'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/app/components/AuthProvider';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/routes', label: 'Routes' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/tracking', label: 'Live Tracking' }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const authLinks = isAuthenticated
    ? [
        { href: '/parent-dashboard', label: 'Parent Portal' },
        { href: '/driver-dashboard', label: 'Driver App' }
      ]
    : [
        { href: '/login', label: 'Log in' },
        { href: '/register', label: 'Register' }
      ];

  const links = [...publicLinks, ...authLinks];

  const onLogout = async () => {
    const result = await logout();
    setNotice(result.message);
    setMobileMenuOpen(false);
    if (result.success) {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">
          Mzansi Scholar Transport
        </Link>

        <button
          className="rounded-md border border-slate-300 p-2 text-slate-700 md:hidden"
          onClick={() => setMobileMenuOpen((value) => !value)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          type="button"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'text-slate-900' : 'hover:text-slate-900'}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated && !loading ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              aria-label="Log out of your account"
            >
              Log out
            </button>
          ) : null}
        </nav>
      </div>

      {isAuthenticated && user ? <p className="px-4 pb-3 text-xs text-slate-500 md:px-8">Signed in as {user.fullName} ({user.role})</p> : null}
      {!loading && notice ? (
        <p className="mx-4 mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 md:mx-8" role="status">
          {notice}
        </p>
      ) : null}

      {mobileMenuOpen ? (
        <nav id="mobile-nav" className="border-t border-slate-200 bg-white px-4 py-3 md:hidden" aria-label="Mobile">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onLogout}
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Log out
            </button>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
