'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home } from 'lucide-react';
import LogoutButton from './LogoutButton';

interface AdminNavbarProps {
  showLogout?: boolean;
}

export default function AdminNavbar({ showLogout = true }: AdminNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image 
            src="/logo-icon.png" 
            alt="Oaureal Icon" 
            width={40} 
            height={40} 
            className="w-10 h-10 object-contain"
          />
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
          {showLogout && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
}
