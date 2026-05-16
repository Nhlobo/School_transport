import { NextResponse } from 'next/server';
import { getSessionCookieValue } from '@/app/api/auth/_shared';
import { parseSessionToken } from '@/app/lib/auth-session';

export async function GET() {
  const token = getSessionCookieValue();
  const user = parseSessionToken(token);

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({ authenticated: true, user });
}
