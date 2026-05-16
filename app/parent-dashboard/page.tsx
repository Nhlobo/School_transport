import { Navbar } from '../components/Navbar';

export default function ParentDashboard() {
  const cards = ['Transport Status', 'Pickup ETA', 'Notifications', 'Payment History', 'Receipts', 'Emergency Contact', 'Voice Notes', 'Digital Consent'];
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((c) => <div key={c} className="glass rounded-2xl p-5 transition hover:-translate-y-1">{c}</div>)}
        </div>
      </section>
    </main>
  );
}
