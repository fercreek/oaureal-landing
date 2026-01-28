'use client';

import { motion } from 'framer-motion';
import { ChevronDown, CheckSquare } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg z-10" />
        <div className="w-full h-full bg-bg-secondary flex items-center justify-center opacity-40">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-[800px] h-[800px] rounded-full border border-primary/20 flex items-center justify-center"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-10 rounded-full border border-primary/20"
            />
          </div>
        </div>
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
            <Button as="a" href="#quiz" className="flex items-center gap-2">
              Haz el test gratis y descubre qué necesita tu sistema hoy <CheckSquare size={18} />
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
