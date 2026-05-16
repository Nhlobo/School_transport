import { NextRequest } from 'next/server';
import { handleResetPassword } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  return handleResetPassword(request);
}
