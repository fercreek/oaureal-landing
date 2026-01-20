'use client';

import { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      update: () => void;
      draw: () => void;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2;
      }

      update() {
        this.x += this.vx * (isPlaying ? 5 : 1);
        this.y += this.vy * (isPlaying ? 5 : 1);
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = isPlaying ? '#a5f0fa' : '#54008c';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      if (isPlaying) {
        ctx.strokeStyle = '#a5f0fa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < canvas!.width; i++) {
          const y = canvas!.height / 2 + Math.sin(i * 0.05 + Date.now() * 0.01) * 30;
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
  }, [isPlaying]);

  return (
    <div className="relative w-full h-48 bg-black/50 rounded-2xl overflow-hidden border border-white/10 group">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-[#a5f0fa] flex items-center justify-center shadow-[0_0_20px_#a5f0fa] transition-transform hover:scale-110 active:scale-95 z-10"
        >
          {isPlaying ? <Pause color="black" fill="black" /> : <Play color="black" fill="black" className="ml-1" />}
        </button>
      </div>
      <div className="absolute bottom-4 left-6 text-xs text-[#a5f0fa] opacity-60 font-mono tracking-widest">
        WEB AUDIO ENGINE V.2.6
      </div>
    </div>
  );
}
