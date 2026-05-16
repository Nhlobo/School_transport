import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { canAccessRole, parseSessionToken } from '../lib/auth-session';

export default function ParentDashboard() {
  const token = cookies().get('mst_session')?.value;
  const user = parseSessionToken(token);
  if (!user || !canAccessRole(user.role, ['parent', 'admin'])) {
    redirect('/login?next=/parent-dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-3 md:px-8">
        <div className="rounded-xl border bg-white p-5 md:col-span-2"><h1 className="text-2xl font-bold">Parent Dashboard Overview</h1><div className="mt-4 grid gap-3 sm:grid-cols-2">{['Vehicle Status: Active Morning Route','Driver: Sipho Dlamini','Vehicle: Toyota Avanza','Current Route: Naledi → Pimville Route','ETA: 12 Minutes','Students Onboard: 4/6','Current Speed: 42 km/h'].map(v=><div key={v} className="rounded-lg border bg-slate-50 p-3 text-sm font-medium">{v}</div>)}</div></div>
        <div className="rounded-xl border bg-white p-5"><h2 className="font-semibold">Security Systems</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm"><li>OTP Authentication</li><li>Device Recognition</li><li>Role-Based Access</li><li>Session Expiration</li><li>Secure Route Access</li></ul></div>
        <div className="rounded-xl border bg-white p-5 md:col-span-3"><h2 className="text-xl font-bold">Child Status Card</h2><div className="mt-3 rounded-lg border bg-slate-50 p-4 text-sm"><p className="font-semibold">Lethabo Mathebula</p><p>School: Pimville Primary</p><p>Status: Onboard</p><p>Pickup Time: 06:42</p><p>School Arrival: Pending</p><p>Seat Number: 4</p><p>Emergency Contact: +27 72 000 1122</p></div></div>
      </section>
    </main>
  );
}
