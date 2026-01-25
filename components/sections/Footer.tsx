'use client';

import { Brain, Youtube, Instagram, Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-24 px-6 bg-bg-secondary border-t border-white/5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Brain size={20} color="black" />
              </div>
              <span className="text-2xl font-logo font-bold tracking-tighter uppercase italic text-primary">Oaureal</span>
            </div>
            <p className="text-text-muted text-sm mb-10 leading-relaxed max-w-sm font-body">
              Sincroniza tu biología. Domina tu mente. Entrenamiento sonoro diseñado por expertos para la regulación del sistema nervioso.
            </p>
            <div className="flex gap-6">
              <a href="#" className="p-3 rounded-full bg-white/5 text-text-muted hover:text-primary hover:bg-white/10 transition-all">
                <Youtube size={20} />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/5 text-text-muted hover:text-primary hover:bg-white/10 transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/5 text-text-muted hover:text-primary hover:bg-white/10 transition-all">
                <Music size={20} />
              </a>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] text-text-secondary tracking-[0.2em] uppercase font-subtitle">
            <span>© 2026 OAUREAL LABS. TODOS LOS DERECHOS RESERVADOS.</span>
            <div className="flex gap-4">
              <a href="/blog" className="hover:text-text">Blog</a>
              <a href="#" className="hover:text-text">Aviso Legal</a>
              <a href="#" className="hover:text-text">Privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
