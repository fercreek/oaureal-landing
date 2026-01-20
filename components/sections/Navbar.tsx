'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function Navbar() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#011797] to-[#a5f0fa] flex items-center justify-center">
            <Brain size={18} color="white" />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase italic">Oaureal</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest text-gray-400">
          <a 
            href="#about" 
            onClick={(e) => handleScrollTo(e, 'about')}
            className="hover:text-[#a5f0fa] transition-colors"
          >
            ¿QUÉ ES?
          </a>
          <a 
            href="#science" 
            onClick={(e) => handleScrollTo(e, 'science')}
            className="hover:text-[#a5f0fa] transition-colors"
          >
            CIENCIA
          </a>
          <a 
            href="#quiz" 
            onClick={(e) => handleScrollTo(e, 'quiz')}
            className="hover:text-[#a5f0fa] transition-colors font-bold"
          >
            TEST
          </a>
          <Link href="/blog" className="hover:text-[#a5f0fa] transition-colors">BLOG</Link>
        </div>
        <button className="px-5 py-2 rounded-full border border-[#a5f0fa]/30 text-[#a5f0fa] text-xs font-bold hover:bg-[#a5f0fa]/10 transition-all">
          PLATAFORMA
        </button>
      </div>
    </nav>
  );
}
