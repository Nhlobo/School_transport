'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestPasswordResetSchema, type RequestPasswordResetInput } from '@/app/lib/validation';
import { Navbar } from '@/app/components/Navbar';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const form = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    mode: 'onChange',
    defaultValues: { southAfricanId: '', phoneNumber: '' }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus('');
    const response = await fetch('/api/auth/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string };
    if (!response.ok) {
      setStatus(data.message || 'Unable to request password reset.');
      return;
    }

    setStatus(data.message || 'OTP requested.');
    router.push('/verify-otp');
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto w-full max-w-xl px-4 py-10">
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" noValidate>
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="mt-2 text-sm text-slate-600">Verify your identity to request a one-time password.</p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700" htmlFor="southAfricanId">
              South African ID Number
            </label>
            <input id="southAfricanId" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...form.register('southAfricanId')} />
            {form.formState.errors.southAfricanId && <p className="text-xs text-red-600">{form.formState.errors.southAfricanId.message}</p>}

            <label className="block text-sm font-medium text-slate-700" htmlFor="phoneNumber">
              Phone number
            </label>
            <input id="phoneNumber" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...form.register('phoneNumber')} />
            {form.formState.errors.phoneNumber && <p className="text-xs text-red-600">{form.formState.errors.phoneNumber.message}</p>}
          </div>

          {status && <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">{status}</p>}

          <button type="submit" disabled={form.formState.isSubmitting} className="mt-5 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70">
            {form.formState.isSubmitting ? 'Please wait…' : 'Request OTP'}
          </button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Remember your password?{' '}
            <Link href="/login" className="font-semibold text-emerald-700">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
