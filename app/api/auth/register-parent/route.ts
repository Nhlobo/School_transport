import { NextRequest } from 'next/server';
import { handleRegisterParent } from '@/app/api/auth/_shared';
export async function POST(request: NextRequest){ return handleRegisterParent(request); }
