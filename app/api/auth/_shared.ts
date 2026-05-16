import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createDefaultUser, createSessionToken, SESSION_COOKIE_NAME, type SessionUser, type UserRole } from '@/app/lib/auth-session';

type AuthRequestBody = {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
};

type BackendAuthResponse = {
  user?: SessionUser;
};

type AuthMode = 'login' | 'signup';

function getBackendBaseUrl() {
  const value = process.env.AUTH_API_BASE_URL || process.env.BACKEND_API_BASE_URL || '';
  return value.replace(/\/+$/, '');
}

function validateBody(body: AuthRequestBody, mode: AuthMode) {
  const errors: string[] = [];
  const email = body.email?.trim().toLowerCase() || '';
  const password = body.password || '';
  const name = body.name?.trim() || '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (mode === 'signup' && name.length < 2) {
    errors.push('Please enter your full name.');
  }

  return {
    errors,
    payload: {
      email,
      password,
      name
    }
  };
}

async function tryBackendAuth(mode: AuthMode, body: AuthRequestBody) {
  const backendBase = getBackendBaseUrl();
  if (!backendBase) {
    return null;
  }

  const response = await fetch(`${backendBase}/api/auth/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store'
  });

  const data = (await response.json().catch(() => ({}))) as BackendAuthResponse & { message?: string };
  if (!response.ok) {
    return NextResponse.json(
      {
        success: false,
        message: data.message || 'Authentication failed. Please check your details and try again.'
      },
      { status: response.status }
    );
  }

  if (!data.user) {
    return NextResponse.json({ success: false, message: 'Authentication service returned an invalid response.' }, { status: 502 });
  }

  return createAuthSuccessResponse(data.user, mode === 'signup');
}

function createAuthSuccessResponse(user: SessionUser, isSignup: boolean) {
  const token = createSessionToken(user);
  const response = NextResponse.json({
    success: true,
    message: isSignup ? 'Account created successfully.' : 'Welcome back!',
    user
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8
  });

  return response;
}

export async function handleAuthRequest(mode: AuthMode, body: AuthRequestBody) {
  const { errors, payload } = validateBody(body, mode);
  if (errors.length > 0) {
    return NextResponse.json({ success: false, message: errors.join(' ') }, { status: 400 });
  }

  const backendResult = await tryBackendAuth(mode, body);
  if (backendResult) {
    return backendResult;
  }

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        success: false,
        message: 'Authentication service is unavailable. Contact support to complete sign in.'
      },
      { status: 503 }
    );
  }

  const fallbackUser = createDefaultUser(payload.email, payload.name || 'School Transport User', body.role);
  return createAuthSuccessResponse(fallbackUser, mode === 'signup');
}

export function clearSessionResponse() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export function getSessionCookieValue() {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}
