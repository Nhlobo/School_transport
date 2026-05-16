'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsAuthenticated(document.cookie.includes('mst_auth=1'));
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'mst_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'mst_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">
          Mzansi Scholar Transport
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/routes" className="hover:text-slate-900">Routes</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          <Link href="/tracking" className="hover:text-slate-900">Live Tracking</Link>
          <Link href="/parent-dashboard" className="hover:text-slate-900">Parent Portal</Link>
          <Link href="/driver-dashboard" className="hover:text-slate-900">Driver App</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="rounded-md bg-slate-900 px-3 py-1.5 text-white">Logout</button>
          ) : (
            <Link href="/login" className="rounded-md bg-indigo-600 px-3 py-1.5 text-white">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
