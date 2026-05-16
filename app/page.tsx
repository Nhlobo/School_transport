import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, BellRing, Car, Gauge, MapPinned, ShieldCheck, Siren, UserCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';

const trustItems: [string, any][] = [
  ['PDP Verified Drivers', UserCheck],
  ['Daily Vehicle Safety Checks', ShieldCheck],
  ['Real-Time Parent Notifications', BellRing],
  ['Child Pickup Verification', BadgeCheck],
  ['GPS Route Monitoring', MapPinned],
  ['Emergency Response Support', Siren],
  ['Speed Monitoring', Gauge],
  ['Seatbelt Compliance', Car]
];

const drivers = [
  { name: 'Sipho Dlamini', exp: '8 Years Scholar Transport', lang: 'Zulu, English, Sotho' },
  { name: 'Thandi Mokoena', exp: '6 Years Scholar Transport', lang: 'Zulu, English, Tswana' }
];

export default function HomePage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <Navbar />
      <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=2000&q=80" alt="Scholar transport pickup in Soweto" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-white md:px-8">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">Safe & Verified Scholar Transport Across Soweto</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-100 md:text-lg">Real-time child safety tracking, verified drivers, and reliable school transport trusted by modern parents.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/parent-dashboard" className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950">Register Your Child</Link>
            <Link href="/parent-dashboard" className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-900">Parent Login</Link>
            <Link href="/tracking" className="rounded-lg border border-white/70 px-5 py-3 font-semibold">View Transport Routes</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <h2 className="text-2xl font-bold">Trust & Safety Standards</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {trustItems.map(([label, Icon]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><Icon className="h-5 w-5 text-emerald-700"/><p className="mt-2 text-sm font-medium">{label}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">{['Parent registers child.','Child assigned to route based on location and school.','Parent receives pickup schedule.','Driver verifies pickup using secure OTP or QR code.','Live transport updates sent automatically.','Parent receives school arrival confirmation.'].map((s,i)=><li key={s} className="rounded-xl border border-slate-200 bg-white p-4 text-sm"><span className="font-semibold">Step {i+1}: </span>{s}</li>)}</ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <h2 className="text-2xl font-bold">Live Operations Today</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">{['Routes Active Today: 4','Current Weather: 12°C, Clear in Soweto','Average On-Time Arrivals: 96%','Vehicle Safety Status: All checks passed','Morning Routes Running: 3/3','Afternoon Routes Scheduled: 4'].map((s)=><div key={s} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium">{s}</div>)}</div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 md:grid-cols-2 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-bold">Driver Verification</h3><div className="mt-4 space-y-3">{drivers.map(d=><div key={d.name} className="rounded-lg bg-slate-50 p-4 text-sm"><p className="font-semibold">Driver: {d.name}</p><p>Experience: {d.exp}</p><p>Languages: {d.lang}</p><p>PDP Verified: Yes</p><p>Emergency Training: Certified</p></div>)}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-bold">Vehicle Safety: Toyota Avanza</h3><Image src="https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80" alt="Toyota Avanza vehicle" width={900} height={600} className="mt-4 rounded-xl object-cover"/><ul className="mt-4 list-disc space-y-1 pl-5 text-sm"><li>Roadworthy verified</li><li>Fully insured</li><li>GPS installed</li><li>Speed monitored</li><li>Daily inspections completed</li><li>Child-safe seating</li></ul></div>
      </section>
    </main>
  );
}
