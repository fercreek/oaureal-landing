'use client';

import Link from 'next/link';
import Image from 'next/image';

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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo-white.png" 
            alt="Oaureal Logo" 
            width={180} 
            height={50} 
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-subtitle tracking-widest text-text-muted">
          <a 
            href="#about" 
            onClick={(e) => handleScrollTo(e, 'about')}
            className="hover:text-primary transition-colors"
          >
            ¿QUÉ ES?
          </a>
          <a 
            href="#science" 
            onClick={(e) => handleScrollTo(e, 'science')}
            className="hover:text-primary transition-colors"
          >
            CIENCIA
          </a>
          <a 
            href="#quiz" 
            onClick={(e) => handleScrollTo(e, 'quiz')}
            className="hover:text-primary transition-colors font-bold"
          >
            TEST
          </a>
          <Link href="/blog" className="hover:text-primary transition-colors">BLOG</Link>
        </div>
        <button className="px-5 py-2 rounded-full border border-primary/30 text-primary text-xs font-subtitle font-bold hover:bg-primary/10 transition-all">
          PLATAFORMA
        </button>
      </div>
    </nav>
  );
}
