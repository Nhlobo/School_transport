import { Navbar } from '../components/Navbar';

export default function PricingPage() {
  return <main className="min-h-screen bg-slate-50 text-slate-900"><Navbar /><section className="mx-auto max-w-4xl px-4 py-10"><h1 className="text-3xl font-bold">Monthly Pricing</h1><div className="mt-4 rounded-lg border bg-white p-5 text-sm"><p>Standard Soweto route: R1,450/month.</p><p>Extended route: R1,850/month.</p><p>Invoices generated monthly with outstanding balance tracking.</p></div></section></main>;
}
