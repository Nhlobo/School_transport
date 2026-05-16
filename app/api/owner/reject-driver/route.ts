import { NextRequest } from 'next/server';
import { handleOwnerRejectDriver } from '@/app/api/auth/_shared';
export async function POST(request: NextRequest){ return handleOwnerRejectDriver(request); }
