import Link from 'next/link';
import { ShieldCheck, Smartphone, PhoneCall } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Mzansi Scholar Transport</h2>
            <p className="mt-3 text-sm text-slate-600">A premium school transport operating system built for safety, trust, and peace of mind.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/tracking" className="hover:text-slate-900">Live tracking</Link></li>
              <li><Link href="/routes" className="hover:text-slate-900">Coverage routes</Link></li>
              <li><Link href="/pricing" className="hover:text-slate-900">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Trust & Compliance</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> POPIA compliant</li>
              <li>Verified schools & insured transport</li>
              <li>Encrypted ride tracking</li>
              <li>Secure payments</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Support</h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><PhoneCall className="h-4 w-4 text-amber-600" /> Emergency: +27 72 000 1122</p>
            <p className="mt-2 text-sm text-slate-600">ops@mzansischolartransport.co.za</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Smartphone className="h-4 w-4 text-slate-900" /> iOS & Android app coming soon</p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-500">© {new Date().getFullYear()} Mzansi Scholar Transport. All rights reserved.</div>
      </div>
    </footer>
  );
}
