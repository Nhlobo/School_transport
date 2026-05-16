import { Navbar } from '../components/Navbar';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">No In-App Parent Payments</h1>
        <div className="mt-4 rounded-lg border bg-white p-5 text-sm space-y-2">
          <p>Parents do not pay on this system.</p>
          <p>All payment discussions and agreements are handled offline after identity verification.</p>
          <p>Use the Parent Dashboard contact details to arrange a meeting for contract signing or banking details confirmation.</p>
        </div>
      </section>
    </main>
  );
}
