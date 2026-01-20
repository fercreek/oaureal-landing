'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <div className="w-full h-full bg-[#050505] flex items-center justify-center opacity-40">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-[800px] h-[800px] rounded-full border border-[#011797]/20 flex items-center justify-center"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-10 rounded-full border border-[#54008c]/20"
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
          <h1 className="text-5xl md:text-8xl font-serif leading-tight mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Sincroniza tu biología. <br />
            <span className="italic">Domina tu mente.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Entrenamiento cerebral con sonidos binaurales de precisión científica para regular tu sistema nervioso.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a href="#quiz" className="px-10 py-5 bg-[#a5f0fa] text-black font-bold rounded-full shadow-[0_0_30px_#a5f0fa] hover:scale-105 transition-all flex items-center gap-2">
              Haz el test gratis <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
      >
        <ChevronDown />
      </motion.div>
    </header>
  );
}
