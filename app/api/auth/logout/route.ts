import { clearSessionResponse } from '@/app/api/auth/_shared';

export async function POST() {
  return clearSessionResponse();
}
