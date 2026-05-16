'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Navbar() {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="text-lg font-semibold text-taxiGold">Mzansi Scholar Transport</Link>
        <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
          <Link href="/parent-dashboard">Parents</Link>
          <Link href="/driver-dashboard">Driver</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <button className="glass rounded-full p-2" onClick={toggleDarkMode} aria-label="Toggle theme">
          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
