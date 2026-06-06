'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full scale-[1.35] md:scale-[1.25] origin-center">
          <video
            src="/video/portada.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center min-h-full min-w-full"
          />
        </div>
        <div className="absolute inset-0 bg-black/60 z-5" />
        <div className="absolute right-0 bottom-0 w-full h-full bg-linear-to-b from-transparent to-bg z-10" />
      </div>

      <div className="relative z-20 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-8xl font-palatino leading-tight mb-6 text-white">
            Entiende desde qué estado está operando tu mente.
          </h1>
          <p className="text-lg md:text-xl font-palatino text-text-muted mb-10 max-w-2xl mx-auto">
            Tu sistema nervioso tiene un perfil. El test lo revela en 3 minutos — y el protocolo acompaña tu regulación desde ahí.
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
