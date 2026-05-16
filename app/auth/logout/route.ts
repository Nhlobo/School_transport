import { NextRequest } from 'next/server';
import { handleLogout } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  return handleLogout(request);
}
