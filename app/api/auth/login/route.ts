import { NextRequest, NextResponse } from 'next/server';
import { handleAuthRequest } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    return handleAuthRequest('login', body);
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request payload.' }, { status: 400 });
  }
}
