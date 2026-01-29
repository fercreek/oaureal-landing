'use client';

import { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useColorTheme } from '@/lib/hooks/useColorTheme';

type ParticleLike = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  update: (isPlaying: boolean) => void;
  draw: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    isPlaying: boolean,
    theme: { primary: string; primaryDark: string }
  ) => void;
};

function createParticle(
  canvas: HTMLCanvasElement
): ParticleLike {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const vx = (Math.random() - 0.5) * 1;
  const vy = (Math.random() - 0.5) * 1;
  const size = Math.random() * 2;
  return {
    x,
    y,
    vx,
    vy,
    size,
    update(isPlaying: boolean) {
      this.x += this.vx * (isPlaying ? 5 : 1);
      this.y += this.vy * (isPlaying ? 5 : 1);
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    },
    draw(
      ctx: CanvasRenderingContext2D,
      c: HTMLCanvasElement,
      isPlaying: boolean,
      theme: { primary: string; primaryDark: string }
    ) {
      ctx.fillStyle = isPlaying ? theme.primary : theme.primaryDark;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}

const wavePresets: Record<string, { freq: number; time: number; amp: number; shape?: 'sine' | 'sharp' }> = {
  THETA: { freq: 0.02, time: 0.004, amp: 42, shape: 'sine' },
  ALFA: { freq: 0.04, time: 0.008, amp: 36, shape: 'sine' },
  BETA: { freq: 0.065, time: 0.014, amp: 28, shape: 'sharp' },
  GAMMA: { freq: 0.11, time: 0.022, amp: 22, shape: 'sharp' },
};

interface AudioVisualizerProps {
  externalPlaying?: boolean;
  trackName?: string | null;
  onCenterClick?: () => void;
}

export default function AudioVisualizer({ externalPlaying = false, trackName = null, onCenterClick }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const isPlaying = onCenterClick ? externalPlaying : (internalPlaying || externalPlaying);
  const { theme } = useColorTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: ParticleLike[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 50; i++) particles.push(createParticle(canvas));

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update(isPlaying);
        p.draw(ctx, canvas, isPlaying, theme);
      });

      if (isPlaying) {
        const preset = trackName && wavePresets[trackName] ? wavePresets[trackName] : { freq: 0.05, time: 0.01, amp: 30, shape: 'sine' as const };
        const t = Date.now() * preset.time;
        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = preset.shape === 'sharp' ? 1.5 : 2;
        ctx.beginPath();
        const center = canvas.height / 2;
        for (let i = 0; i < canvas.width; i++) {
          const phase = i * preset.freq + t;
          let y: number;
          if (preset.shape === 'sharp') {
            const s = Math.sin(phase);
            const h = Math.sin(phase * 2 + t * 0.5) * 0.35;
            y = center + (s + h) * preset.amp;
          } else {
            y = center + Math.sin(phase) * preset.amp;
          }
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying, theme, trackName]);

  return (
    <div className="relative w-full h-48 bg-black/50 rounded-2xl overflow-hidden border border-white/10 group">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => (onCenterClick ? onCenterClick() : setInternalPlaying(!internalPlaying))}
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_var(--color-primary)] transition-transform hover:scale-110 active:scale-95 z-10"
        >
          {isPlaying ? <Pause color="black" fill="black" /> : <Play color="black" fill="black" className="ml-1" />}
        </button>
      </div>
      <div className="absolute bottom-4 left-6 text-xs text-primary opacity-60 font-subtitle tracking-widest">
        {trackName ? `${trackName} · WEB AUDIO ENGINE V.2.6` : 'WEB AUDIO ENGINE V.2.6'}
      </div>
    </div>
  );
}
