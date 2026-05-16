import { NextRequest } from 'next/server';
import { handleLogin } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  return handleLogin(request);
}
