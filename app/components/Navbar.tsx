import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/routes', label: 'Routes' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/tracking', label: 'Live Tracking' },
  { href: '/parent-dashboard', label: 'Parent Portal' },
  { href: '/driver-dashboard', label: 'Driver App' }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">
          Mzansi Scholar Transport
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav className="border-t border-slate-200 bg-white px-4 py-2 md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-medium text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
