import { Navbar } from '../components/Navbar';

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-3 md:px-8">
        <div className="rounded-xl border bg-white p-5 md:col-span-2"><h1 className="text-2xl font-bold">Route Tracking</h1><div className="mt-4 h-64 rounded-lg bg-slate-200 p-4 text-sm">Google Maps API container (route progress, pickup markers, school destination, traffic overlay).</div></div>
        <div className="space-y-4"><div className="rounded-xl border bg-white p-4 text-sm"><p className="font-semibold">Next Pickup Location</p><p>Meadowlands Zone 4 - Stop C</p></div><div className="rounded-xl border bg-white p-4 text-sm"><p className="font-semibold">Trip State</p><p>En Route</p></div><div className="rounded-xl border bg-white p-4 text-sm"><p className="font-semibold">Safety Updates</p><p>All seatbelts confirmed • Speed within limit</p></div></div>
      </section>
    </main>
  );
}
