'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtpSchema, type VerifyOtpInput } from '@/app/lib/validation';
import { Navbar } from '@/app/components/Navbar';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    mode: 'onChange',
    defaultValues: {
      southAfricanId: '',
      phoneNumber: '',
      otp: ''
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus('');
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string };
    if (!response.ok) {
      setStatus(data.message || 'OTP verification failed.');
      return;
    }

    router.push('/reset-password');
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto w-full max-w-xl px-4 py-10">
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" noValidate>
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="mt-2 text-sm text-slate-600">Enter the 6-digit OTP sent to your verified phone number.</p>

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

            <label className="block text-sm font-medium text-slate-700" htmlFor="otp">
              OTP code
            </label>
            <input id="otp" inputMode="numeric" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...form.register('otp')} />
            {form.formState.errors.otp && <p className="text-xs text-red-600">{form.formState.errors.otp.message}</p>}
          </div>

          {status && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{status}</p>}

          <button type="submit" disabled={form.formState.isSubmitting} className="mt-5 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70">
            {form.formState.isSubmitting ? 'Please wait…' : 'Verify OTP'}
          </button>
        </form>
      </section>
    </main>
  );
}
