import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/app/components/AuthForm';
import { Navbar } from '@/app/components/Navbar';
import { parseSessionToken } from '@/app/lib/auth-session';

export default function SignupPage() {
  const token = cookies().get('mst_session')?.value;
  const user = parseSessionToken(token);

  if (user) {
    redirect(user.role === 'driver' ? '/driver-dashboard' : '/parent-dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
        <div className="rounded-2xl bg-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="mt-3 text-sm text-emerald-50">Get real-time transport updates, safer pickups, and school-arrival notifications from day one.</p>
        </div>
        <AuthForm mode="signup" />
      </section>
    </main>
  );
}
