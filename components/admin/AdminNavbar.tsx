'use client';

import Link from 'next/link';
import { Home, Brain } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center">
            <Brain size={18} color="white" />
          </div>
          <span className="text-xl font-logo font-bold tracking-tighter uppercase italic text-primary">Oaureal Admin</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-primary transition-colors font-subtitle text-sm"
          >
            <Home size={18} />
            Ver Sitio
          </Link>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
