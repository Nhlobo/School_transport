'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@/app/lib/validation';
import { Navbar } from '@/app/components/Navbar';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      southAfricanId: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus('');

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string };
    if (!response.ok) {
      setStatus(data.message || 'Unable to reset password.');
      return;
    }

    router.push('/login');
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto w-full max-w-xl px-4 py-10">
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" noValidate>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="mt-2 text-sm text-slate-600">Create a new strong password to secure your account.</p>

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

            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              New password
            </label>
            <input id="password" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...form.register('password')} />
            {form.formState.errors.password && <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>}

            <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input id="confirmPassword" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...form.register('confirmPassword')} />
            {form.formState.errors.confirmPassword && <p className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>}
          </div>

          {status && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{status}</p>}

          <button type="submit" disabled={form.formState.isSubmitting} className="mt-5 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70">
            {form.formState.isSubmitting ? 'Please wait…' : 'Reset password'}
          </button>
        </form>
      </section>
    </main>
  );
}
