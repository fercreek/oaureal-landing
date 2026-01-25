'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPreviewProps {
  name: string;
  frequency: string;
  duration: number;
  description: string;
  color: string;
  binauralFreq: number;
}

export default function AudioPreview({
  name,
  frequency,
  duration,
  description,
  color,
  binauralFreq
}: AudioPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let time = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < width; i++) {
        const x = i;
        const baseY = height / 2;
        const amplitude = 30 + Math.sin(time * 0.02 + i * 0.01) * 10;
        const y = baseY + Math.sin((i * 0.05) + (time * 0.01 * binauralFreq)) * amplitude;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, color, binauralFreq]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration * 60) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / (duration * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center">
          <Radio size={24} color="white" />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-white mb-1">{name}</h3>
          <p className="text-sm text-gray-400">{frequency}</p>
        </div>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>

      <div className="relative w-full h-32 bg-black/50 rounded-2xl overflow-hidden border border-white/10 mb-6 group">
        <canvas
          ref={canvasRef}
          width={800}
          height={128}
          className="absolute inset-0 w-full h-full"
        />
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isPlaying ? 0 : 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">Preview del audio</p>
              <p className="text-primary text-xs font-subtitle">Presiona play para simular</p>
            </div>
          </motion.div>
        )}
        {isPlaying && (
          <div className="absolute top-2 right-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>{formatTime(currentTime)} / {duration} min</span>
          </div>
          <span className="text-xs font-mono">Frecuencia: {binauralFreq} Hz</span>
        </div>

        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-16 h-16 rounded-full text-black font-bold transition-all relative overflow-hidden"
            style={{
              backgroundColor: color,
              boxShadow: isPlaying ? `0 0 30px ${color}60` : `0 0 20px ${color}40`
            }}
          >
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
            <span className="relative z-10">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </span>
          </motion.button>

          <div className="flex-1">
            <motion.p
              key={isPlaying ? 'playing' : 'paused'}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-gray-500 mb-1"
            >
              Estado: <span className="font-bold" style={{ color }}>{isPlaying ? 'Reproduciendo' : 'Pausado'}</span>
            </motion.p>
            <motion.p
              key={isPlaying ? 'playing-desc' : 'paused-desc'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-primary italic font-body"
            >
              {isPlaying ? 'Simulación activa - Usa audífonos para el efecto completo' : 'Este es un preview simulado'}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
