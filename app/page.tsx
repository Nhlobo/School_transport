import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from './components/Navbar';
import { StatCard } from './components/Cards';

const stats = [
  ['Children transported', '2,450+'],
  ['Years of service', '8'],
  ['Routes completed', '11,900+'],
  ['Parent satisfaction', '98.6%']
];

const gallery = [
  {
    title: 'Safe morning pickups',
    src: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Friendly driver support',
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Reliable school arrivals',
    src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80'
  }
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
            <Link href="/parent-dashboard" className="rounded-xl bg-taxiGold px-5 py-3 font-semibold text-black transition hover:brightness-95">Register Child</Link>
            <Link href="/tracking" className="rounded-xl border border-white/20 px-5 py-3 transition hover:bg-white/10">Track Transport</Link>
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-zinc-300">Live route preview • Orlando West ➜ Pimville ➜ Meadowlands</p>
          <div className="relative mt-4 h-64 overflow-hidden rounded-2xl">
            <Image src="https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1200&q=80" alt="School transport vehicle route in city" fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([t, v]) => <StatCard key={t} title={t} value={v} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <h2 className="text-2xl font-semibold md:text-3xl">Trusted by families every school day</h2>
        <p className="mt-2 text-zinc-300">Real trips, real safety checks, and real-time visibility for every parent.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {gallery.map((item) => (
            <article key={item.title} className="glass overflow-hidden rounded-2xl">
              <div className="relative h-56">
                <Image src={item.src} alt={item.title} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" />
              </div>
              <p className="p-4 text-sm font-medium text-zinc-100">{item.title}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
