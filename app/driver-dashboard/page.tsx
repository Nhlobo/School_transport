import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { canAccessRole, parseSessionToken } from '../lib/auth-session';

const actions = ['Start Route', 'Student Attendance', 'Navigate Route', 'Emergency Button', 'Trip Completion', 'Fuel Logging'];

export default function DriverDashboard() {
  const token = cookies().get('mst_session')?.value;
  const user = parseSessionToken(token);
  if (!user || !canAccessRole(user.role, ['driver', 'admin'])) {
    redirect('/login?next=/driver-dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold">Driver Route Console</h1>
        <p className="mt-1 text-sm text-slate-600">Assigned Route: Orlando West Route • Vehicle: Toyota Avanza • Trip State: Picking Up</p>
        <div className="mt-5 grid gap-3">{actions.map(a => <button key={a} className="rounded-xl border border-slate-300 bg-white px-4 py-5 text-left text-lg font-semibold shadow-sm">{a}</button>)}</div>
      </section>
    </main>
  );
}
