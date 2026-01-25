'use client';

import AudioVisualizer from '@/components/features/AudioVisualizer';

export default function AudioSection() {
  return (
    <section className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-title mb-4 italic text-primary">Escucha la frecuencia</h2>
        <p className="text-text-muted mb-12 font-body">Experimenta el pulso neural de Oaureal</p>
        <AudioVisualizer />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Enfoque Alpha', 'Calma Theta', 'Sueño Delta'].map(track => (
            <button key={track} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-colors text-sm font-subtitle tracking-widest text-text-muted hover:text-primary">
              {track}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
