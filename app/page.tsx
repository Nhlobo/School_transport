import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, BellRing, CheckCircle2, Languages, MapPinned, ShieldCheck, UserCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';

const fleet = [
  { name: 'Toyota Avanza', seats: '7 Seater', safety: '4.9/5 Safety', route: 'Midrand · Sandton · Bryanston', img: 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Hyundai H1', seats: '12 Seater', safety: '4.8/5 Safety', route: 'Soweto · Roodepoort · Randburg', img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Quantum', seats: '16 Seater', safety: '4.9/5 Safety', route: 'Pretoria East · Centurion · Hatfield', img: 'https://images.unsplash.com/photo-1549399542-7e82138f43c8?auto=format&fit=crop&w=1200&q=80' }
];

const drivers = [
  { name: 'Lerato Mokoena', years: '9 years', rating: '4.9', lang: 'English, Zulu, Sotho' },
  { name: 'Sibusiso Ndlovu', years: '7 years', rating: '4.8', lang: 'English, Xhosa, Afrikaans' },
  { name: 'Nomsa Dlamini', years: '11 years', rating: '5.0', lang: 'English, Zulu, Tswana' }
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

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-3xl font-bold">Live Map Operations</h2>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-3">{['Driver arriving in 4 mins', 'Child checked in safely', 'Route operating normally'].map((t) => <div key={t} className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold">{t}</div>)}</div>
          <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-4">
            {['14 active routes', '42 moving vehicles', '97 pickup points', 'Avg ETA accuracy 96%'].map((s) => <div key={s} className="rounded-xl border border-slate-200 p-3">{s}</div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-3xl font-bold">Fleet Showcase</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">{fleet.map((v) => <article key={v.name} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1"><Image src={v.img} alt={v.name} width={900} height={600} className="h-44 w-full object-cover" /><div className="p-5"><h3 className="text-lg font-bold">{v.name}</h3><p className="mt-1 text-sm text-slate-500">{v.route}</p><div className="mt-3 space-y-2 text-sm"><p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> {v.safety}</p><p className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-amber-600" /> GPS tracked</p><p className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-slate-800" /> Seatbelt indicators active · {v.seats}</p></div></div></article>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-3xl font-bold">Safety System</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5 text-center text-sm">{['Child pickup', 'QR scan', 'Parent notified', 'GPS activated', 'Arrival confirmed'].map((step) => <div key={step} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{step}</div>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-3xl font-bold">Verified Drivers</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">{drivers.map((d) => <div key={d.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md"><div className="mb-4 h-14 w-14 rounded-full bg-slate-200" /><p className="text-lg font-bold">{d.name}</p><p className="mt-1 text-sm text-slate-500">{d.years} experience · Rating {d.rating}</p><p className="mt-2 flex items-center gap-2 text-sm"><Languages className="h-4 w-4" /> {d.lang}</p><p className="mt-2 flex items-center gap-2 text-sm text-emerald-700"><UserCheck className="h-4 w-4" /> Verified + Background Checked</p></div>)}</div>
      </section>
    </main>
  );
}
