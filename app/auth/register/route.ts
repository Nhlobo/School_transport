import { NextRequest } from 'next/server';
import { handleRegister } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  return handleRegister(request);
}
