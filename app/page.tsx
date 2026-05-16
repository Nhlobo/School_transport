'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, BellRing, CheckCircle2, Languages, MapPinned, ShieldCheck, UserCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';

const trustPillars = [
  'Verified Drivers & PDP Checks',
  'Live GPS Tracking On Every Route',
  'Real-Time Parent Alerts',
  'Secure QR Child Verification'
];

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

      <section className="relative isolate min-h-screen overflow-hidden px-4 pb-16 pt-24 md:px-8">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_10%,#fdba7420,transparent_45%),radial-gradient(circle_at_80%_20%,#22c55e1f,transparent_45%),#f8fafc]" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex rounded-full border border-amber-300/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 backdrop-blur">South Africa's Trusted School Transport OS</p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Your Child&apos;s Safety Starts Before School Begins.</h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">Track every ride, verify every driver, and receive real-time school transport updates across South Africa.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tracking" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">Track School Transport</Link>
              <Link href="/register" className="rounded-2xl border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur transition hover:-translate-y-0.5">Secure Your Child&apos;s Seat</Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              {trustPillars.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl bg-white/70 p-3 shadow-sm backdrop-blur"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{item}</div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-2xl backdrop-blur-xl">
              <Image src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80" alt="School transport vehicle on route" width={1200} height={900} className="h-[460px] w-full rounded-3xl object-cover" />
              <div className="absolute left-8 top-8 rounded-xl border border-white/50 bg-white/80 px-3 py-2 text-xs font-medium shadow-md">Live Route: Sandton → St Stithians</div>
              <div className="absolute bottom-8 right-8 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs shadow-lg">
                <p className="flex items-center gap-2 font-semibold text-emerald-700"><BellRing className="h-4 w-4" /> Child checked in safely</p>
                <p className="mt-1 text-slate-500">Mom notified at 06:42</p>
              </div>
            </div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -left-8 top-16 hidden rounded-xl border border-slate-200 bg-white/90 p-3 text-xs shadow-xl md:block"><p className="font-semibold">Driver arriving in 4 mins</p><p className="text-slate-500">Toyota Avanza · CNR 5th Ave</p></motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4.2 }} className="absolute -bottom-5 left-20 hidden rounded-xl border border-slate-200 bg-white/90 p-3 text-xs shadow-xl md:block"><p className="font-semibold">QR pickup verified</p><p className="text-slate-500">Learner: Amahle N.</p></motion.div>
          </div>
        </motion.div>
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
