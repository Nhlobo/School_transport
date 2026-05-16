import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">
          Mzansi Scholar Transport
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <Link href="/tracking" className="hover:text-slate-900">Live Tracking</Link>
          <Link href="/parent-dashboard" className="hover:text-slate-900">Parent Portal</Link>
          <Link href="/driver-dashboard" className="hover:text-slate-900">Driver App</Link>
        </nav>
      </div>
    </header>
  );
}
