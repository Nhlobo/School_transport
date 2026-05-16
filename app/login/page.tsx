import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/app/components/AuthForm';
import { Navbar } from '@/app/components/Navbar';
import { parseSessionToken } from '@/app/lib/auth-session';

export default function LoginPage() {
  const token = cookies().get('mst_session')?.value;
  const user = parseSessionToken(token);

  if (user) {
    redirect(user.role === 'driver' ? '/driver-dashboard' : '/parent-dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
        <div className="rounded-2xl bg-slate-900 p-6 text-white">
          <h2 className="text-2xl font-bold">Secure sign in</h2>
          <p className="mt-3 text-sm text-slate-200">Access route status, driver communication, and child pickup confirmations in one secure dashboard.</p>
        </div>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
