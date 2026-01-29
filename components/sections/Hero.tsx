'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          src="/video/portada.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg z-10" />
      </div>

      <div className="relative z-20 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-8xl font-title leading-tight mb-6 text-primary italic">
            Sintoniza tu ritmo interno
          </h1>
          <p className="text-lg md:text-xl font-body text-text-muted mb-10 max-w-2xl mx-auto italic">
            Reduce el ruido mental y crea condiciones para que tu sistema nervioso empiece a entrenarse en estados de calma, enfoque o descanso profundo mediante técnicas y audios binaurales personalizados.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button as="a" href="#quiz">
              Haz el test gratis y descubre qué necesita tu sistema hoy
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-muted"
      >
        <ChevronDown />
      </motion.div>
    </header>
  );
}
