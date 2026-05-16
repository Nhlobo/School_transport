import { redirect } from 'next/navigation';
import { AuthForm } from '@/app/components/AuthForm';
import { Navbar } from '@/app/components/Navbar';
import { validateCurrentSession } from '@/app/lib/auth-server';

export default async function RegisterPage() {
  const session = await validateCurrentSession();

  if (session) {
    redirect(session.user.role === 'driver' ? '/driver-dashboard' : '/parent-dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
        <div className="rounded-2xl bg-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Create protected access</h2>
          <p className="mt-3 text-sm text-emerald-50">Register securely as a parent or driver with strong verification and real-time validation.</p>
        </div>
        <AuthForm mode="register" />
      </section>
    </main>
  );
}
