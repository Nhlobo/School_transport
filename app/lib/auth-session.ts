import { createHmac, randomUUID } from 'crypto';

export type UserRole = 'parent' | 'driver' | 'admin';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

type SessionPayload = SessionUser & {
  exp: number;
};

export const SESSION_COOKIE_NAME = 'mst_session';
const SESSION_TTL_HOURS = 8;
const SESSION_TTL_SECONDS = SESSION_TTL_HOURS * 60 * 60;

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) {
    throw new Error('AUTH_SESSION_SECRET must be configured.');
  }

  return secret;
}

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf-8').toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf-8');
}

function signPayload(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

export function parseSessionToken(token: string | undefined | null): SessionUser | null {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [encoded, signature] = token.split('.', 2);
  const expected = signPayload(encoded);
  if (expected !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export function createDefaultUser(email: string, name: string): SessionUser {
  return {
    id: randomUUID(),
    email,
    name,
    role: 'parent'
  };
}

export function canAccessRole(userRole: UserRole, allowed: UserRole[]) {
  return allowed.includes(userRole);
}
