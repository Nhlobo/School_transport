import { handleSession } from '@/app/api/auth/_shared';

export async function GET() {
  return handleSession();
}
