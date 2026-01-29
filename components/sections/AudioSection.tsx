'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import AudioVisualizer from '@/components/features/AudioVisualizer';

const audioTracks = [
  { name: 'THETA', file: '/audio/theta.wav', description: 'Relajación profunda' },
  { name: 'ALFA', file: '/audio/alfa.wav', description: 'Calma y creatividad' },
  { name: 'BETA', file: '/audio/beta.wav', description: 'Enfoque y concentración' },
  { name: 'GAMMA', file: '/audio/gamma.wav', description: 'Alto rendimiento' },
];

export default function AudioSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (trackName: string, file: string) => {
    if (playing === trackName) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(file);
      audioRef.current.volume = 0.5;
      audioRef.current.play();
      audioRef.current.onended = () => setPlaying(null);
      setPlaying(trackName);
    }
  };

  return (
    <section className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-title mb-4 italic text-primary">Escucha algunas frecuencias OAUREAL</h2>
        <AudioVisualizer
          externalPlaying={playing !== null}
          trackName={playing}
          onCenterClick={() => handlePlay('THETA', audioTracks[0].file)}
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {audioTracks.map(track => (
            <button 
              key={track.name}
              onClick={() => handlePlay(track.name, track.file)}
              className={`p-6 rounded-2xl border transition-all text-center group ${
                playing === track.name
                  ? 'border-primary bg-primary/20 shadow-[0_0_30px_var(--color-primary)]'
                  : 'border-white/10 bg-bg hover:bg-primary/10 hover:border-primary/30 hover:shadow-[0_0_20px_var(--color-primary)]'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {playing === track.name ? (
                  <Pause size={20} className="text-primary" />
                ) : (
                  <Play size={20} className="text-primary opacity-50 group-hover:opacity-100" />
                )}
                <span className="text-lg font-subtitle font-bold tracking-widest text-primary">
                  {track.name}
                </span>
              </div>
              <p className="text-xs text-text-muted font-body">
                {track.description}
              </p>
              {playing === track.name && (
                <div className="flex items-center justify-center gap-1 mt-3">
                  <Volume2 size={14} className="text-primary animate-pulse" />
                  <span className="text-xs text-primary font-body">Reproduciendo...</span>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="mt-8 text-sm text-text-muted font-body">
          🎧 Usa audífonos para una mejor experiencia
        </p>
      </div>
    </section>
  );
}
