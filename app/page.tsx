import Link from 'next/link';
import { Navbar } from './components/Navbar';
import { StatCard } from './components/Cards';

const stats = [
  ['Children transported', '2,450+'],
  ['Years of service', '8'],
  ['Routes completed', '11,900+'],
  ['Parent satisfaction', '98.6%']
];

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:px-8">
        <div>
          <p className="mb-3 inline-block rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Safe Rides. Smart Futures.</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">Safe & Reliable School Transport Around Soweto</h1>
          <p className="mt-4 max-w-xl text-zinc-300">A premium township-focused platform for trusted daily school runs using verified drivers, live tracking, smart ETA, and secure monthly payments.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/parent-dashboard" className="rounded-xl bg-taxiGold px-5 py-3 font-semibold text-black">Register Child</Link>
            <Link href="/tracking" className="rounded-xl border border-white/20 px-5 py-3">Track Transport</Link>
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-zinc-300">Live route preview • Orlando West ➜ Pimville ➜ Meadowlands</p>
          <div className="mt-4 h-64 rounded-2xl bg-neon" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([t, v]) => <StatCard key={t} title={t} value={v} />)}
        </div>
      </section>
    </main>
  );
}
