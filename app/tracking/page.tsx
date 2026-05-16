import { Navbar } from '../components/Navbar';

export default function TrackingPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h1 className="text-3xl font-bold">Live Tracking</h1>
        <p className="mt-2 text-zinc-300">Google Maps integration placeholder with animated route lines, traffic-aware ETA and pickup points.</p>
        <div className="glass mt-6 h-80 rounded-3xl p-6">Map Canvas</div>
      </section>
    </main>
  );
}
