import { NextRequest, NextResponse } from 'next/server';
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  type LoginInput,
  type RegisterInput,
  type RequestPasswordResetInput,
  type ResetPasswordInput,
  type VerifyOtpInput
} from '@/app/lib/validation';
import {
  clearAuthCookies,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestPasswordReset,
  resetPassword,
  validateCurrentSession,
  verifyPasswordResetOtp
} from '@/app/lib/auth-server';

function assertTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin || !host) {
    return;
  }

  const normalizedHost = host.toLowerCase();
  let originHost = '';
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    throw new Error('Invalid request origin.');
  }

  if (originHost !== normalizedHost) {
    throw new Error('Cross-site request blocked.');
  }
}

async function getJsonBody<T>(request: NextRequest) {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error('Invalid request payload.');
  }
}

function toErrorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : 'Request failed.';
  return NextResponse.json({ success: false, message }, { status });
}

export async function handleRegister(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const payload = registerSchema.parse(await getJsonBody<RegisterInput>(request));
    const user = await registerUser(payload);
    return NextResponse.json({ success: true, message: 'Account created successfully.', user }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 400);
  }
}

export async function handleLogin(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const payload = loginSchema.parse(await getJsonBody<LoginInput>(request));
    const user = await loginUser(payload);
    return NextResponse.json({ success: true, message: 'Login successful.', user });
  } catch (error) {
    return toErrorResponse(error, 401);
  }
}

export async function handleLogout(request?: NextRequest) {
  if (request) {
    assertTrustedOrigin(request);
  }
  await logoutUser();
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}

export async function handleRefresh(request?: NextRequest) {
  try {
    if (request) {
      assertTrustedOrigin(request);
    }
    const user = await refreshUserSession();
    return NextResponse.json({ success: true, message: 'Session refreshed.', user });
  } catch (error) {
    clearAuthCookies();
    return toErrorResponse(error, 401);
  }
}

export async function handleSession(requiredRole?: 'parent' | 'driver') {
  try {
    const result = await validateCurrentSession(requiredRole);

    if (!result) {
      clearAuthCookies();
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: result.user });
  } catch {
    clearAuthCookies();
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}

export async function handleRequestPasswordReset(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const payload = requestPasswordResetSchema.parse(await getJsonBody<RequestPasswordResetInput>(request));
    await requestPasswordReset(payload);

    return NextResponse.json({
      success: true,
      message: 'If your details are correct, an OTP has been sent to your verified phone number.'
    });
  } catch (error) {
    return toErrorResponse(error, 400);
  }
}

export async function handleVerifyOtp(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const payload = verifyOtpSchema.parse(await getJsonBody<VerifyOtpInput>(request));
    await verifyPasswordResetOtp(payload);
    return NextResponse.json({ success: true, message: 'OTP verified. You can now reset your password.' });
  } catch (error) {
    return toErrorResponse(error, 400);
  }
}

export async function handleResetPassword(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const payload = resetPasswordSchema.parse(await getJsonBody<ResetPasswordInput>(request));
    await resetPassword(payload);
    return NextResponse.json({ success: true, message: 'Password reset successful. Please log in again.' });
  } catch (error) {
    return toErrorResponse(error, 400);
  }
}
