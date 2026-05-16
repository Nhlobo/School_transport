import { redirect } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { validateCurrentSession } from '../lib/auth-server';

export const dynamic = 'force-dynamic';

export default async function ParentDashboard() {
  const session = await validateCurrentSession('parent');
  if (!session) {
    redirect('/login?next=/parent-dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-3 md:px-8">
        <div className="rounded-xl border bg-white p-5 md:col-span-2"><h1 className="text-2xl font-bold">Parent Dashboard Overview</h1><div className="mt-4 grid gap-3 sm:grid-cols-2">{['Vehicle Status: Active Morning Route','Driver: Sipho Dlamini','Vehicle: Toyota Avanza','Current Route: Naledi → Pimville Route','ETA: 12 Minutes','Students Onboard: 4/6','Current Speed: 42 km/h'].map(v=><div key={v} className="rounded-lg border bg-slate-50 p-3 text-sm font-medium">{v}</div>)}</div></div>
        <div className="rounded-xl border bg-white p-5"><h2 className="font-semibold">Security Systems</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm"><li>OTP Authentication</li><li>Device Recognition</li><li>Role-Based Access</li><li>Session Expiration</li><li>Secure Route Access</li><li>No in-app payments accepted</li><li>Verified contact-only onboarding</li></ul></div>
        <div className="rounded-xl border bg-white p-5 md:col-span-2">
          <h2 className="text-xl font-bold">Driver & Admin Contact Details</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg border bg-slate-50 p-4">
              <p className="font-semibold">Assigned Driver</p>
              <p>Name: Sipho Dlamini</p>
              <p>Call / WhatsApp: +27 72 000 1122</p>
              <p>Vehicle: Toyota Avanza</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4">
              <p className="font-semibold">Transport Admin</p>
              <p>Name: Admin Office</p>
              <p>Call: +27 11 555 0101</p>
              <p>Email: ops@mzansischolartransport.co.za</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-700">Set up a meeting with the driver/admin for contract signing and bank detail confirmation. Never send money to unknown numbers.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 md:col-span-3">
          <h2 className="text-lg font-bold text-amber-900">Scammer Protection Rules</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
            <li>The platform does not collect parent payments.</li>
            <li>Only use contact numbers shown inside your authenticated dashboard.</li>
            <li>Confirm the driver South African ID and vehicle registration in person before any contract signing.</li>
            <li>Report suspicious payment requests immediately to admin.</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-white p-5 md:col-span-3"><h2 className="text-xl font-bold">Child Status Card</h2><div className="mt-3 rounded-lg border bg-slate-50 p-4 text-sm"><p className="font-semibold">Lethabo Mathebula</p><p>School: Pimville Primary</p><p>Status: Onboard</p><p>Pickup Time: 06:42</p><p>School Arrival: Pending</p><p>Seat Number: 4</p><p>Emergency Contact: +27 72 000 1122</p></div></div>
      </section>
    </main>
  );
}
