import { Navbar } from '../components/Navbar';

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-3 md:px-8">
        <div className="rounded-xl border bg-white p-5 md:col-span-2">
          <h1 className="text-2xl font-bold">Live Route Tracking (OpenStreetMap)</h1>
          <div className="mt-4 h-64 rounded-lg border bg-slate-100 p-4 text-sm">
            Map container for Leaflet/MapLibre with OSM tiles, live Toyota Avanza marker, pickup stops, school destination, and ETA overlay.
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-4 text-sm"><p className="font-semibold">Next Pickup</p><p>Meadowlands Zone 4 - Stop C</p></div>
          <div className="rounded-xl border bg-white p-4 text-sm"><p className="font-semibold">Trip State</p><p>PICKING_UP</p></div>
          <div className="rounded-xl border bg-white p-4 text-sm"><p className="font-semibold">Safety</p><p>Speed compliant • Geofence in range • OTP required</p></div>
        </div>
      </section>
    </main>
  );
}
