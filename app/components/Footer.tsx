import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 md:grid-cols-3 md:px-8">
        <div>
          <h2 className="font-semibold text-slate-900">Mzansi Scholar Transport</h2>
          <p className="mt-2">Safe, reliable, and verified school transport services for Soweto families.</p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Quick links</h2>
          <ul className="mt-2 space-y-1">
            <li><Link href="/tracking" className="hover:text-slate-900">Live tracking</Link></li>
            <li><Link href="/contact" className="hover:text-slate-900">Support</Link></li>
            <li><Link href="/parent-dashboard" className="hover:text-slate-900">Parent onboarding</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Contact</h2>
          <p className="mt-2">WhatsApp: +27 72 000 1122</p>
          <p>Email: ops@mzansischolartransport.co.za</p>
          <p className="mt-2 text-xs text-slate-500">© {new Date().getFullYear()} Mzansi Scholar Transport</p>
        </div>
      </div>
    </footer>
  );
}
