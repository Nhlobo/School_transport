import { NextRequest } from 'next/server';
import { handleRequestPasswordReset } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  return handleRequestPasswordReset(request);
}
