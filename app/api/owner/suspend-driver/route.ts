import { NextRequest } from 'next/server';
import { handleOwnerSuspendDriver } from '@/app/api/auth/_shared';
export async function POST(request: NextRequest){ return handleOwnerSuspendDriver(request); }
