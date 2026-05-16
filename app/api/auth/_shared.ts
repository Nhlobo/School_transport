import { NextRequest, NextResponse } from 'next/server';
import { loginSchema, registerSchema, registerParentSchema, registerDriverSchema, requestPasswordResetSchema, resetPasswordSchema, verifyOtpSchema, type LoginInput, type RegisterInput, type RegisterParentInput, type RegisterDriverInput, type RequestPasswordResetInput, type ResetPasswordInput, type VerifyOtpInput } from '@/app/lib/validation';
import { clearAuthCookies, loginUser, logoutUser, refreshUserSession, registerParentUser, registerDriverUser, requestPasswordReset, resetPassword, validateCurrentSession, verifyPasswordResetOtp, ownerApproveDriver, ownerRejectDriver, ownerSuspendDriver } from '@/app/lib/auth-server';

function assertTrustedOrigin(request: NextRequest) { const o=request.headers.get('origin'); const h=request.headers.get('host'); if(!o||!h) return; if(new URL(o).host.toLowerCase()!==h.toLowerCase()) throw new Error('Cross-site request blocked.'); }
async function getJsonBody<T>(request: NextRequest){ try { return (await request.json()) as T;} catch { throw new Error('Invalid request payload.'); } }
function toErrorResponse(error: unknown, status=400){ return NextResponse.json({success:false,message:error instanceof Error?error.message:'Request failed.'},{status}); }

export async function handleRegisterParent(request: NextRequest){ try { assertTrustedOrigin(request); const payload=registerParentSchema.parse(await getJsonBody<RegisterParentInput>(request)); const user=await registerParentUser(payload); return NextResponse.json({success:true,user,message:'Parent account created.'},{status:201}); } catch(e){ return toErrorResponse(e,400);} }
export async function handleRegisterDriver(request: NextRequest){ try { assertTrustedOrigin(request); const payload=registerDriverSchema.parse(await getJsonBody<RegisterDriverInput>(request)); const user=await registerDriverUser(payload); return NextResponse.json({success:true,user,message:'Driver registration submitted for owner verification.'},{status:201}); } catch(e){ return toErrorResponse(e,400);} }
export async function handleRegister(request: NextRequest){
  try {
    assertTrustedOrigin(request);
    const payload = registerSchema.parse(await getJsonBody<RegisterInput>(request));
    if (payload.role === 'driver') {
      const user = await registerDriverUser({ ...payload, vehicleRegistrationNumber: payload.vehicleRegistrationNumber ?? payload.pdpLicenseNumber });
      return NextResponse.json({ success: true, user, message: 'Driver registration submitted for owner verification.' }, { status: 201 });
    }
    const user = await registerParentUser(payload);
    return NextResponse.json({ success: true, user, message: 'Parent account created.' }, { status: 201 });
  } catch (e) { return toErrorResponse(e, 400); }
}

export async function handleLogin(request: NextRequest){ try { assertTrustedOrigin(request); const payload=loginSchema.parse(await getJsonBody<LoginInput>(request)); const user=await loginUser(payload); return NextResponse.json({success:true,message:'Login successful.',user}); } catch(e){ return toErrorResponse(e,401);} }
export async function handleLogout(request?: NextRequest){ if(request) assertTrustedOrigin(request); await logoutUser(); return NextResponse.json({success:true,message:'Logged out successfully.'}); }
export async function handleRefresh(request?: NextRequest){ try { if(request) assertTrustedOrigin(request); const user=await refreshUserSession(); return NextResponse.json({success:true,message:'Session refreshed.',user}); } catch(e){ clearAuthCookies(); return toErrorResponse(e,401);} }
export async function handleSession(requiredRole?: 'parent'|'driver'|'owner'){ try { const result=await validateCurrentSession(requiredRole); if(!result){ clearAuthCookies(); return NextResponse.json({authenticated:false,user:null},{status:401}); } return NextResponse.json({authenticated:true,user:result.user}); } catch { clearAuthCookies(); return NextResponse.json({authenticated:false,user:null},{status:401}); } }
export async function handleRequestPasswordReset(request: NextRequest){ try { assertTrustedOrigin(request); const payload=requestPasswordResetSchema.parse(await getJsonBody<RequestPasswordResetInput>(request)); await requestPasswordReset(payload); return NextResponse.json({success:true,message:'If your details are correct, an OTP has been sent.'}); } catch(e){ return toErrorResponse(e,400);} }
export async function handleVerifyOtp(request: NextRequest){ try { assertTrustedOrigin(request); const payload=verifyOtpSchema.parse(await getJsonBody<VerifyOtpInput>(request)); await verifyPasswordResetOtp(payload); return NextResponse.json({success:true,message:'OTP verified.'}); } catch(e){ return toErrorResponse(e,400);} }
export async function handleResetPassword(request: NextRequest){ try { assertTrustedOrigin(request); const payload=resetPasswordSchema.parse(await getJsonBody<ResetPasswordInput>(request)); await resetPassword(payload); return NextResponse.json({success:true,message:'Password reset successful.'}); } catch(e){ return toErrorResponse(e,400);} }

export async function handleOwnerApproveDriver(request: NextRequest){ try { assertTrustedOrigin(request); const body=await getJsonBody<{driverId:string;vehicleRegistrationNumber:string}>(request); await ownerApproveDriver(body.driverId, body.vehicleRegistrationNumber); return NextResponse.json({success:true}); } catch(e){ return toErrorResponse(e,403);} }
export async function handleOwnerRejectDriver(request: NextRequest){ try { assertTrustedOrigin(request); const body=await getJsonBody<{driverId:string;reason?:string}>(request); await ownerRejectDriver(body.driverId, body.reason); return NextResponse.json({success:true}); } catch(e){ return toErrorResponse(e,403);} }
export async function handleOwnerSuspendDriver(request: NextRequest){ try { assertTrustedOrigin(request); const body=await getJsonBody<{driverId:string;reason?:string}>(request); await ownerSuspendDriver(body.driverId, body.reason); return NextResponse.json({success:true}); } catch(e){ return toErrorResponse(e,403);} }
