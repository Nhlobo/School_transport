'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAuth } from '@/app/components/AuthProvider';

type AuthMode = 'login' | 'signup';

type AuthFormProps = {
  mode: AuthMode;
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';
  const nextUrl = searchParams.get('next');

  const submitLabel = useMemo(() => (isSignup ? 'Create account' : 'Log in'), [isSignup]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (isSignup && name.trim().length < 2) {
      setStatus({ type: 'error', message: 'Please enter your full name.' });
      return;
    }

    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Password confirmation does not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const result = isSignup ? await signup(name.trim(), email.trim(), password) : await login(email.trim(), password);
      setStatus({ type: result.success ? 'success' : 'error', message: result.message });

      if (result.success) {
        router.push(nextUrl || '/parent-dashboard');
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
      <p className="mt-2 text-sm text-slate-600">{isSignup ? 'Set up your account to track transport updates.' : 'Log in to access your secure dashboard.'}</p>

      <div className="mt-6 space-y-4">
        {isSignup && (
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </label>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Email address
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
          />
        </label>

        {isSignup && (
          <label className="block text-sm font-medium text-slate-700">
            Confirm password
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
        )}
      </div>

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
        {submitting ? 'Please wait…' : submitLabel}
      </button>

      <p className="mt-4 text-center text-sm text-slate-600">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link href={isSignup ? '/login' : '/signup'} className="font-semibold text-emerald-700 hover:text-emerald-800">
          {isSignup ? 'Log in' : 'Sign up'}
        </Link>
      </p>
    </form>
  );
}
