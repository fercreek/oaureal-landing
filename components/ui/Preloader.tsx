'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
          filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 relative"
      >
        <div className="absolute inset-0 rounded-full border-2 border-[#a5f0fa] opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain size={64} color="#a5f0fa" />
        </div>
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-[#a5f0fa] tracking-[0.3em] font-light text-sm"
      >
        CALIBRANDO FRECUENCIAS
      </motion.p>
    </motion.div>
  );
}
