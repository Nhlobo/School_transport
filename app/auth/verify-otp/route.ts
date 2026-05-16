import { NextRequest } from 'next/server';
import { handleVerifyOtp } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  return handleVerifyOtp(request);
}
