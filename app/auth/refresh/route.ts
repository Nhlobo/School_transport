import { NextRequest } from 'next/server';
import { handleRefresh } from '@/app/api/auth/_shared';

export async function POST(request: NextRequest) {
  return handleRefresh(request);
}
