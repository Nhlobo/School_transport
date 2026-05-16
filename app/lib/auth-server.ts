import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { randomInt, randomUUID, createHash } from 'crypto';
import { Pool } from 'pg';
import type {
  LoginInput,
  RegisterInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
  UserRole,
  VerifyOtpInput
} from '@/app/lib/validation';
import {
  normalizePhoneNumber,
  normalizeSouthAfricanId,
  passwordSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  verifyOtpSchema
} from '@/app/lib/validation';

export const ACCESS_COOKIE_NAME = 'mst_access';
export const REFRESH_COOKIE_NAME = 'mst_refresh';
const RESET_COOKIE_NAME = 'mst_reset';
const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;
const RESET_TTL_SECONDS = 10 * 60;
const LOCKOUT_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const OTP_TTL_MINUTES = 5;

export type AuthUser = {
  id: string;
  role: UserRole;
  fullName: string;
  southAfricanId: string;
  phoneNumber: string;
};

type SessionRecord = {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  device_fingerprint: string;
  ip_address: string;
  user_agent: string;
  expires_at: Date;
  created_at: Date;
};

type UserRecord = {
  id: string;
  role: UserRole;
  full_name: string;
  south_african_id: string;
  phone_number: string;
  pdp_license_number: string | null;
  password_hash: string;
  failed_login_attempts: number;
  locked_until: Date | null;
  created_at: Date;
};

type OtpRecord = {
  id: string;
  user_id: string;
  otp_hash: string;
  purpose: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
};

type AuthTokenPayload = JwtPayload & {
  sub: string;
  role: UserRole;
  sid: string;
  dfp: string;
  tokenType: 'access' | 'refresh' | 'reset';
};

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined
    })
  : null;

const memory = {
  users: new Map<string, UserRecord>(),
  sessions: new Map<string, SessionRecord>(),
  otpCodes: new Map<string, OtpRecord>(),
  loginAttempts: [] as Array<{ id: string; south_african_id: string; ip_address: string; success: boolean; timestamp: Date }>
};

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function assertJwtSecrets() {
  if (!process.env.AUTH_ACCESS_TOKEN_SECRET || !process.env.AUTH_REFRESH_TOKEN_SECRET || !process.env.AUTH_RESET_TOKEN_SECRET) {
    throw new Error('AUTH_ACCESS_TOKEN_SECRET, AUTH_REFRESH_TOKEN_SECRET and AUTH_RESET_TOKEN_SECRET must be configured.');
  }
}

function now() {
  return new Date();
}

function addSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000);
}

function addMinutes(date: Date, minutes: number) {
  return addSeconds(date, minutes * 60);
}

function hashForFingerprint(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function getRequestIp() {
  const forwardedFor = headers().get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return headers().get('x-real-ip') || 'unknown';
}

export function getDeviceFingerprint() {
  const requestHeaders = headers();
  const explicitFingerprint = requestHeaders.get('x-device-fingerprint');
  if (explicitFingerprint) {
    return explicitFingerprint;
  }

  const signature = [
    requestHeaders.get('user-agent') || 'unknown',
    requestHeaders.get('accept-language') || 'unknown',
    requestHeaders.get('sec-ch-ua') || 'unknown',
    getRequestIp()
  ].join('|');

  return hashForFingerprint(signature);
}

function mapUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    role: user.role,
    fullName: user.full_name,
    southAfricanId: user.south_african_id,
    phoneNumber: user.phone_number
  };
}

function createToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>, secret: string, expiresInSeconds: number) {
  return jwt.sign(payload, secret, { expiresIn: expiresInSeconds });
}

function verifyToken(token: string, secret: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, secret) as AuthTokenPayload;
  } catch {
    return null;
  }
}

function requireAuthConfig() {
  if (!pool && !(process.env.NODE_ENV === 'development' && process.env.ENABLE_DEV_AUTH_FALLBACK === 'true')) {
    throw new Error('DATABASE_URL must be configured. For local development only, set ENABLE_DEV_AUTH_FALLBACK=true.');
  }

  assertJwtSecrets();
}

function enforceRateLimit(key: string, max: number, windowMs: number) {
  const timestamp = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= timestamp) {
    rateLimitBuckets.set(key, { count: 1, resetAt: timestamp + windowMs });
    return;
  }

  if (bucket.count >= max) {
    throw new Error('Too many attempts. Please wait and try again.');
  }

  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);
}

function createAccessToken(user: AuthUser, sessionId: string, deviceFingerprint: string) {
  return createToken(
    {
      sub: user.id,
      role: user.role,
      sid: sessionId,
      dfp: deviceFingerprint,
      tokenType: 'access'
    },
    process.env.AUTH_ACCESS_TOKEN_SECRET!,
    ACCESS_TTL_SECONDS
  );
}

function createRefreshToken(user: AuthUser, sessionId: string, deviceFingerprint: string) {
  return createToken(
    {
      sub: user.id,
      role: user.role,
      sid: sessionId,
      dfp: deviceFingerprint,
      tokenType: 'refresh'
    },
    process.env.AUTH_REFRESH_TOKEN_SECRET!,
    REFRESH_TTL_SECONDS
  );
}

function createResetToken(userId: string) {
  return createToken(
    {
      sub: userId,
      role: 'parent',
      sid: randomUUID(),
      dfp: getDeviceFingerprint(),
      tokenType: 'reset'
    },
    process.env.AUTH_RESET_TOKEN_SECRET!,
    RESET_TTL_SECONDS
  );
}

function verifyAccessToken(token: string) {
  return verifyToken(token, process.env.AUTH_ACCESS_TOKEN_SECRET!);
}

function verifyRefreshToken(token: string) {
  return verifyToken(token, process.env.AUTH_REFRESH_TOKEN_SECRET!);
}

function verifyResetToken(token: string) {
  return verifyToken(token, process.env.AUTH_RESET_TOKEN_SECRET!);
}

async function recordLoginAttempt(southAfricanId: string, success: boolean) {
  const ipAddress = getRequestIp();

  if (pool) {
    await pool.query(
      'INSERT INTO login_attempts (id, south_african_id, ip_address, success, timestamp) VALUES ($1, $2, $3, $4, NOW())',
      [randomUUID(), southAfricanId, ipAddress, success]
    );
    return;
  }

  memory.loginAttempts.push({ id: randomUUID(), south_african_id: southAfricanId, ip_address: ipAddress, success, timestamp: now() });
}

async function getUserBySouthAfricanId(southAfricanId: string) {
  if (pool) {
    const { rows } = await pool.query<UserRecord>('SELECT * FROM users WHERE south_african_id = $1 LIMIT 1', [southAfricanId]);
    return rows[0] || null;
  }

  for (const user of memory.users.values()) {
    if (user.south_african_id === southAfricanId) {
      return user;
    }
  }

  return null;
}

async function getUserById(userId: string) {
  if (pool) {
    const { rows } = await pool.query<UserRecord>('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId]);
    return rows[0] || null;
  }

  return memory.users.get(userId) || null;
}

async function getUserByPhoneNumber(phoneNumber: string) {
  if (pool) {
    const { rows } = await pool.query<UserRecord>('SELECT * FROM users WHERE phone_number = $1 LIMIT 1', [phoneNumber]);
    return rows[0] || null;
  }

  for (const user of memory.users.values()) {
    if (user.phone_number === phoneNumber) {
      return user;
    }
  }

  return null;
}

async function createUser(input: RegisterInput, passwordHash: string) {
  const user: UserRecord = {
    id: randomUUID(),
    role: input.role,
    full_name: input.fullName.trim(),
    south_african_id: normalizeSouthAfricanId(input.southAfricanId),
    phone_number: normalizePhoneNumber(input.phoneNumber),
    pdp_license_number: input.role === 'driver' ? input.pdpLicenseNumber?.trim() || null : null,
    password_hash: passwordHash,
    failed_login_attempts: 0,
    locked_until: null,
    created_at: now()
  };

  if (pool) {
    await pool.query(
      `INSERT INTO users (id, role, full_name, south_african_id, phone_number, pdp_license_number, password_hash, failed_login_attempts, locked_until, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, NULL, NOW())`,
      [user.id, user.role, user.full_name, user.south_african_id, user.phone_number, user.pdp_license_number, user.password_hash]
    );
  } else {
    memory.users.set(user.id, user);
  }

  return user;
}

async function updateUserLockStatus(userId: string, failedAttempts: number, lockedUntil: Date | null) {
  if (pool) {
    await pool.query('UPDATE users SET failed_login_attempts = $2, locked_until = $3 WHERE id = $1', [userId, failedAttempts, lockedUntil]);
    return;
  }

  const existing = memory.users.get(userId);
  if (existing) {
    existing.failed_login_attempts = failedAttempts;
    existing.locked_until = lockedUntil;
    memory.users.set(userId, existing);
  }
}

async function updateUserPassword(userId: string, passwordHash: string) {
  if (pool) {
    await pool.query('UPDATE users SET password_hash = $2, failed_login_attempts = 0, locked_until = NULL WHERE id = $1', [userId, passwordHash]);
    return;
  }

  const existing = memory.users.get(userId);
  if (existing) {
    existing.password_hash = passwordHash;
    existing.failed_login_attempts = 0;
    existing.locked_until = null;
    memory.users.set(userId, existing);
  }
}

async function deleteUserSessions(userId: string) {
  if (pool) {
    await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
    return;
  }

  for (const [sessionId, session] of memory.sessions.entries()) {
    if (session.user_id === userId) {
      memory.sessions.delete(sessionId);
    }
  }
}

async function createSession(user: AuthUser, refreshToken: string, fingerprint: string) {
  const session: SessionRecord = {
    id: randomUUID(),
    user_id: user.id,
    refresh_token_hash: await bcrypt.hash(refreshToken, 12),
    device_fingerprint: fingerprint,
    ip_address: getRequestIp(),
    user_agent: headers().get('user-agent') || 'unknown',
    expires_at: addSeconds(now(), REFRESH_TTL_SECONDS),
    created_at: now()
  };

  if (pool) {
    await pool.query(
      `INSERT INTO sessions (id, user_id, refresh_token_hash, device_fingerprint, ip_address, user_agent, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [session.id, session.user_id, session.refresh_token_hash, session.device_fingerprint, session.ip_address, session.user_agent, session.expires_at]
    );
  } else {
    memory.sessions.set(session.id, session);
  }

  return session;
}

async function getSessionById(sessionId: string) {
  if (pool) {
    const { rows } = await pool.query<SessionRecord>('SELECT * FROM sessions WHERE id = $1 LIMIT 1', [sessionId]);
    return rows[0] || null;
  }

  return memory.sessions.get(sessionId) || null;
}

async function updateSessionToken(sessionId: string, refreshToken: string) {
  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  const expiresAt = addSeconds(now(), REFRESH_TTL_SECONDS);

  if (pool) {
    await pool.query('UPDATE sessions SET refresh_token_hash = $2, expires_at = $3 WHERE id = $1', [sessionId, refreshTokenHash, expiresAt]);
    return;
  }

  const session = memory.sessions.get(sessionId);
  if (session) {
    session.refresh_token_hash = refreshTokenHash;
    session.expires_at = expiresAt;
    memory.sessions.set(sessionId, session);
  }
}

async function deleteSession(sessionId: string) {
  if (pool) {
    await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    return;
  }

  memory.sessions.delete(sessionId);
}

async function saveOtp(userId: string, otp: string) {
  const otpHash = await bcrypt.hash(otp, 12);

  const otpRecord: OtpRecord = {
    id: randomUUID(),
    user_id: userId,
    otp_hash: otpHash,
    purpose: 'password_reset',
    expires_at: addMinutes(now(), OTP_TTL_MINUTES),
    used: false,
    created_at: now()
  };

  if (pool) {
    await pool.query(
      `INSERT INTO otp_codes (id, user_id, otp_hash, purpose, expires_at, used, created_at)
       VALUES ($1, $2, $3, 'password_reset', $4, FALSE, NOW())`,
      [otpRecord.id, otpRecord.user_id, otpRecord.otp_hash, otpRecord.expires_at]
    );
    return otpRecord;
  }

  memory.otpCodes.set(otpRecord.id, otpRecord);
  return otpRecord;
}

async function getLatestOtp(userId: string) {
  if (pool) {
    const { rows } = await pool.query<OtpRecord>(
      `SELECT * FROM otp_codes
       WHERE user_id = $1 AND purpose = 'password_reset'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  const records = Array.from(memory.otpCodes.values())
    .filter((item) => item.user_id === userId && item.purpose === 'password_reset')
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  return records[0] || null;
}

async function markOtpUsed(otpId: string) {
  if (pool) {
    await pool.query('UPDATE otp_codes SET used = TRUE WHERE id = $1', [otpId]);
    return;
  }

  const otp = memory.otpCodes.get(otpId);
  if (otp) {
    otp.used = true;
    memory.otpCodes.set(otpId, otp);
  }
}

async function deleteOtpCodes(userId: string) {
  if (pool) {
    await pool.query("DELETE FROM otp_codes WHERE user_id = $1 AND purpose = 'password_reset'", [userId]);
    return;
  }

  for (const [otpId, otp] of memory.otpCodes.entries()) {
    if (otp.user_id === userId && otp.purpose === 'password_reset') {
      memory.otpCodes.delete(otpId);
    }
  }
}

function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();

  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ACCESS_TTL_SECONDS
  });

  cookieStore.set({
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: REFRESH_TTL_SECONDS
  });
}

export function clearAuthCookies() {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
  cookieStore.delete(RESET_COOKIE_NAME);
}

export async function registerUser(rawInput: RegisterInput) {
  requireAuthConfig();
  enforceRateLimit(`register:${getRequestIp()}`, 10, 60_000);

  const input: RegisterInput = {
    ...rawInput,
    fullName: rawInput.fullName.trim(),
    southAfricanId: normalizeSouthAfricanId(rawInput.southAfricanId),
    phoneNumber: normalizePhoneNumber(rawInput.phoneNumber),
    pdpLicenseNumber: rawInput.pdpLicenseNumber?.trim()
  };

  const duplicateById = await getUserBySouthAfricanId(input.southAfricanId);
  if (duplicateById) {
    throw new Error('An account with this South African ID already exists.');
  }

  const duplicateByPhone = await getUserByPhoneNumber(input.phoneNumber);
  if (duplicateByPhone) {
    throw new Error('An account with this phone number already exists.');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createUser(input, passwordHash);

  return mapUser(user);
}

export async function loginUser(input: LoginInput) {
  requireAuthConfig();
  const southAfricanId = normalizeSouthAfricanId(input.southAfricanId);
  enforceRateLimit(`login:${getRequestIp()}:${southAfricanId}`, 25, 60_000);

  const user = await getUserBySouthAfricanId(southAfricanId);

  if (!user) {
    await recordLoginAttempt(southAfricanId, false);
    throw new Error('Invalid credentials.');
  }

  const currentDate = now();
  if (user.locked_until && user.locked_until.getTime() > currentDate.getTime()) {
    throw new Error('Account is temporarily locked due to failed login attempts. Try again later.');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password_hash);
  if (!passwordMatches) {
    const failedAttempts = user.failed_login_attempts + 1;
    const lockedUntil = failedAttempts >= LOCKOUT_ATTEMPTS ? addMinutes(currentDate, LOCKOUT_MINUTES) : null;
    await updateUserLockStatus(user.id, failedAttempts, lockedUntil);
    await recordLoginAttempt(southAfricanId, false);

    if (lockedUntil) {
      throw new Error('Account locked for 15 minutes due to repeated failures.');
    }

    throw new Error('Invalid credentials.');
  }

  await updateUserLockStatus(user.id, 0, null);
  await recordLoginAttempt(southAfricanId, true);

  await deleteUserSessions(user.id);

  const authUser = mapUser(user);
  const fingerprint = getDeviceFingerprint();
  const provisionalRefreshToken = createRefreshToken(authUser, randomUUID(), fingerprint);
  const session = await createSession(authUser, provisionalRefreshToken, fingerprint);

  const accessToken = createAccessToken(authUser, session.id, fingerprint);
  const refreshToken = createRefreshToken(authUser, session.id, fingerprint);
  await updateSessionToken(session.id, refreshToken);
  setAuthCookies(accessToken, refreshToken);

  return authUser;
}

export async function refreshUserSession() {
  requireAuthConfig();
  enforceRateLimit(`refresh:${getRequestIp()}`, 60, 60_000);

  const refreshToken = cookies().get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    throw new Error('Refresh token missing.');
  }

  const tokenPayload = verifyRefreshToken(refreshToken);
  if (!tokenPayload || tokenPayload.tokenType !== 'refresh') {
    throw new Error('Invalid refresh token.');
  }

  const session = await getSessionById(tokenPayload.sid);
  if (!session) {
    throw new Error('Session not found.');
  }

  if (session.expires_at.getTime() <= Date.now()) {
    await deleteSession(session.id);
    throw new Error('Session expired.');
  }

  const fingerprint = getDeviceFingerprint();
  if (session.device_fingerprint !== fingerprint || tokenPayload.dfp !== fingerprint) {
    await deleteSession(session.id);
    throw new Error('Device verification failed.');
  }

  const tokenMatches = await bcrypt.compare(refreshToken, session.refresh_token_hash);
  if (!tokenMatches) {
    await deleteSession(session.id);
    throw new Error('Session token mismatch.');
  }

  const user = await getUserById(session.user_id);
  if (!user) {
    await deleteSession(session.id);
    throw new Error('Account not found.');
  }

  const authUser = mapUser(user);
  const nextAccessToken = createAccessToken(authUser, session.id, fingerprint);
  const nextRefreshToken = createRefreshToken(authUser, session.id, fingerprint);

  await updateSessionToken(session.id, nextRefreshToken);
  setAuthCookies(nextAccessToken, nextRefreshToken);

  return authUser;
}

export async function logoutUser() {
  const refreshToken = cookies().get(REFRESH_COOKIE_NAME)?.value;

  if (refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    if (payload?.sid) {
      await deleteSession(payload.sid);
    }
  }

  clearAuthCookies();
}

export async function requestPasswordReset(rawInput: RequestPasswordResetInput) {
  requireAuthConfig();
  const input = requestPasswordResetSchema.parse({
    southAfricanId: normalizeSouthAfricanId(rawInput.southAfricanId),
    phoneNumber: normalizePhoneNumber(rawInput.phoneNumber)
  });

  enforceRateLimit(`password-reset-request:${getRequestIp()}:${input.southAfricanId}`, 5, 15 * 60_000);

  const user = await getUserBySouthAfricanId(input.southAfricanId);

  if (!user || user.phone_number !== input.phoneNumber) {
    return { otpSent: false };
  }

  const otp = `${randomInt(0, 1_000_000)}`.padStart(6, '0');
  await saveOtp(user.id, otp);

  if (process.env.NODE_ENV !== 'production') {
    console.info(`Password reset OTP for ${input.southAfricanId}: ${otp}`);
  }

  return { otpSent: true };
}

export async function verifyPasswordResetOtp(rawInput: VerifyOtpInput) {
  requireAuthConfig();
  const input = verifyOtpSchema.parse({
    southAfricanId: normalizeSouthAfricanId(rawInput.southAfricanId),
    phoneNumber: normalizePhoneNumber(rawInput.phoneNumber),
    otp: rawInput.otp
  });

  enforceRateLimit(`password-reset-verify:${getRequestIp()}:${input.southAfricanId}`, 7, 10 * 60_000);

  const user = await getUserBySouthAfricanId(input.southAfricanId);
  if (!user || user.phone_number !== input.phoneNumber) {
    throw new Error('Invalid verification details.');
  }

  const otpRecord = await getLatestOtp(user.id);
  if (!otpRecord || otpRecord.used || otpRecord.expires_at.getTime() <= Date.now()) {
    throw new Error('OTP is expired or invalid.');
  }

  const otpMatches = await bcrypt.compare(input.otp, otpRecord.otp_hash);
  if (!otpMatches) {
    throw new Error('OTP is invalid.');
  }

  await markOtpUsed(otpRecord.id);

  const resetToken = createResetToken(user.id);
  cookies().set({
    name: RESET_COOKIE_NAME,
    value: resetToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/reset-password',
    maxAge: RESET_TTL_SECONDS
  });

  return { verified: true };
}

export async function resetPassword(rawInput: ResetPasswordInput) {
  requireAuthConfig();
  const input = resetPasswordSchema.parse({
    southAfricanId: normalizeSouthAfricanId(rawInput.southAfricanId),
    phoneNumber: normalizePhoneNumber(rawInput.phoneNumber),
    password: rawInput.password,
    confirmPassword: rawInput.confirmPassword
  });

  enforceRateLimit(`password-reset:${getRequestIp()}:${input.southAfricanId}`, 7, 10 * 60_000);

  passwordSchema.parse(input.password);

  const resetToken = cookies().get(RESET_COOKIE_NAME)?.value;
  if (!resetToken) {
    throw new Error('Password reset session has expired.');
  }

  const payload = verifyResetToken(resetToken);
  if (!payload || payload.tokenType !== 'reset') {
    throw new Error('Invalid password reset session.');
  }

  const user = await getUserBySouthAfricanId(input.southAfricanId);
  if (!user || user.id !== payload.sub || user.phone_number !== input.phoneNumber) {
    throw new Error('Verification failed for password reset.');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  await updateUserPassword(user.id, passwordHash);
  await deleteOtpCodes(user.id);
  await deleteUserSessions(user.id);
  clearAuthCookies();
}

export async function validateCurrentSession(requiredRole?: UserRole) {
  if (!process.env.AUTH_ACCESS_TOKEN_SECRET || !process.env.AUTH_REFRESH_TOKEN_SECRET) {
    return null;
  }

  if (!pool && !(process.env.NODE_ENV === 'development' && process.env.ENABLE_DEV_AUTH_FALLBACK === 'true')) {
    return null;
  }
  const accessToken = cookies().get(ACCESS_COOKIE_NAME)?.value;
  if (!accessToken) {
    return null;
  }

  const payload = verifyAccessToken(accessToken);
  if (!payload || payload.tokenType !== 'access') {
    return null;
  }

  const session = await getSessionById(payload.sid);
  if (!session || session.expires_at.getTime() <= Date.now()) {
    return null;
  }

  const fingerprint = getDeviceFingerprint();
  if (session.device_fingerprint !== fingerprint || payload.dfp !== fingerprint) {
    return null;
  }

  const user = await getUserById(payload.sub);
  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return {
    user: mapUser(user),
    sessionId: session.id
  };
}

export function getAuthCookieNames() {
  return {
    access: ACCESS_COOKIE_NAME,
    refresh: REFRESH_COOKIE_NAME
  };
}
