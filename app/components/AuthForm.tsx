'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/app/components/AuthProvider';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/app/lib/validation';

type AuthMode = 'login' | 'register';

type AuthFormProps = {
  mode: AuthMode;
  nextUrl?: string;
};

export function AuthForm({ mode, nextUrl }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const safeNextUrl = nextUrl && nextUrl.startsWith('/') && !nextUrl.startsWith('//') ? nextUrl : null;

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      southAfricanId: '',
      password: ''
    }
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'parent',
      fullName: '',
      southAfricanId: '',
      phoneNumber: '',
      pdpLicenseNumber: '',
      vehicleRegistrationNumber: '',
      password: '',
      confirmPassword: ''
    } as Partial<RegisterInput>
  });

  const isRegister = mode === 'register';
  const submitting = isRegister ? registerForm.formState.isSubmitting : loginForm.formState.isSubmitting;

  const onSubmitLogin = loginForm.handleSubmit(async (values) => {
    setStatus(null);
    const result = await login(values.southAfricanId, values.password);
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });

    if (result.success) {
      router.push(safeNextUrl || '/parent-dashboard');
      router.refresh();
    }
  });

  const onSubmitRegister = registerForm.handleSubmit(async (values) => {
    setStatus(null);
    const result = await register(values);
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });

    if (result.success) {
      router.push('/login');
      router.refresh();
    }
  });

  const fieldError = (message?: string) => (message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null);

  return (
    <form onSubmit={isRegister ? onSubmitRegister : onSubmitLogin} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <h1 className="text-2xl font-bold text-slate-900">{isRegister ? 'Create secure account' : 'Secure sign in'}</h1>
      <p className="mt-2 text-sm text-slate-600">
        {isRegister ? 'Register as a parent or driver using verified South African identity details.' : 'Use your South African ID and password to access your secure session.'}
      </p>

      <div className="mt-6 space-y-4">
        {isRegister && (
          <>
            <label className="block text-sm font-medium text-slate-700" htmlFor="role">
              Account role
            </label>
            <select
              id="role"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              {...registerForm.register('role')}
              aria-invalid={Boolean(registerForm.formState.errors.role)}
            >
              <option value="parent">Parent</option>
              <option value="driver">Driver</option>
            </select>
            {fieldError(registerForm.formState.errors.role?.message)}

            <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              autoComplete="name"
              {...registerForm.register('fullName')}
              aria-invalid={Boolean(registerForm.formState.errors.fullName)}
            />
            {fieldError(registerForm.formState.errors.fullName?.message)}
          </>
        )}

        <label className="block text-sm font-medium text-slate-700" htmlFor={`${mode}-southAfricanId`}>
          South African ID Number
        </label>
        <input
          id={`${mode}-southAfricanId`}
          inputMode="numeric"
          maxLength={13}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          autoComplete="off"
          {...(isRegister ? registerForm.register('southAfricanId') : loginForm.register('southAfricanId'))}
          aria-invalid={Boolean(isRegister ? registerForm.formState.errors.southAfricanId : loginForm.formState.errors.southAfricanId)}
        />
        {fieldError((isRegister ? registerForm.formState.errors.southAfricanId : loginForm.formState.errors.southAfricanId)?.message)}

        {isRegister && (
          <>
            <label className="block text-sm font-medium text-slate-700" htmlFor="phoneNumber">
              Phone number
            </label>
            <input
              id="phoneNumber"
              inputMode="tel"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              autoComplete="tel"
              {...registerForm.register('phoneNumber')}
              aria-invalid={Boolean(registerForm.formState.errors.phoneNumber)}
            />
            {fieldError(registerForm.formState.errors.phoneNumber?.message)}

            {registerForm.watch('role') === 'driver' && (
              <>
                <label className="block text-sm font-medium text-slate-700" htmlFor="pdpLicenseNumber">
                  PDP license number
                </label>
                <input
                  id="pdpLicenseNumber"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  {...registerForm.register('pdpLicenseNumber')}
                  aria-invalid={Boolean((registerForm.formState.errors as any).pdpLicenseNumber)}
                />
                {fieldError((registerForm.formState.errors as any).pdpLicenseNumber?.message)}
              </>
            )}
          </>
        )}

        <label className="block text-sm font-medium text-slate-700" htmlFor={`${mode}-password`}>
          Password
        </label>
        <div className="flex gap-2">
          <input
            id={`${mode}-password`}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            type={showPassword ? 'text' : 'password'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            {...(isRegister ? registerForm.register('password') : loginForm.register('password'))}
            aria-invalid={Boolean(isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password)}
          />
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {fieldError((isRegister ? registerForm.formState.errors.password : loginForm.formState.errors.password)?.message)}

        {isRegister && (
          <>
            <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...registerForm.register('confirmPassword')}
              aria-invalid={Boolean(registerForm.formState.errors.confirmPassword)}
            />
            {fieldError(registerForm.formState.errors.confirmPassword?.message)}
          </>
        )}
      </div>

      {!isRegister && (
        <p className="mt-3 text-right text-sm">
          <Link href="/forgot-password" className="font-medium text-emerald-700 hover:text-emerald-800">
            Forgot password?
          </Link>
        </p>
      )}

      {status && (
        <p
          className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
            status.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </p>
      )}

      <button
        className="mt-5 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
      </button>

      <p className="mt-4 text-center text-sm text-slate-600">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link href={isRegister ? '/login' : '/register'} className="font-semibold text-emerald-700 hover:text-emerald-800">
          {isRegister ? 'Log in' : 'Register'}
        </Link>
      </p>
    </form>
  );
}
