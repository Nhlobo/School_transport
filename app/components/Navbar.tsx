'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function Navbar() {
  const { darkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-taxiGold">Mzansi Scholar Transport</Link>
        <nav className="hidden gap-6 text-sm font-medium text-zinc-300 md:flex">
          <Link href="/parent-dashboard" className="transition hover:text-white">Parents</Link>
          <Link href="/driver-dashboard" className="transition hover:text-white">Driver</Link>
          <Link href="/admin" className="transition hover:text-white">Admin</Link>
        </nav>
        <button className="glass rounded-full p-2" onClick={toggleDarkMode} aria-label="Toggle theme">
          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
