'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';

const users = {
  parent: { password: 'parent123', route: '/parent-dashboard' },
  driver: { password: 'driver123', route: '/driver-dashboard' },
  admin: { password: 'admin123', route: '/parent-dashboard' }
} as const;

type Role = keyof typeof users;

export default function LoginForm({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>('parent');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const destination = redirect ?? users[role].route;

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password !== users[role].password) {
      setError('Incorrect password. Try demo passwords: parent123, driver123, admin123.');
      return;
    }

    document.cookie = 'mst_auth=1; path=/; max-age=86400; samesite=lax';
    document.cookie = `mst_role=${role}; path=/; max-age=86400; samesite=lax`;
    router.push(destination);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white">
      <Navbar />
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:grid-cols-2 md:p-10">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-indigo-300">Secure Access</p>
            <h1 className="text-3xl font-black leading-tight md:text-5xl">Login to your dashboard</h1>
            <p className="mt-4 text-slate-300">Role-based login now protects internal dashboards and keeps route, child, and driver data private.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <label className="block text-sm font-medium text-slate-200">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2">
              <option value="parent">Parent</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
            <label className="block text-sm font-medium text-slate-200">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password" className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2" />
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400">Sign in</button>
            <p className="text-xs text-slate-400">Demo credentials: parent123 / driver123 / admin123</p>
          </form>
        </div>
      </section>
    </main>
  );
}
