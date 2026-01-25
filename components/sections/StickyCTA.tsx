'use client';

import { motion } from 'framer-motion';

interface StickyCTAProps {
  show: boolean;
}

export default function StickyCTA({ show }: StickyCTAProps) {
  if (!show) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:hidden pointer-events-none"
    >
      <div className="bg-bg/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex items-center justify-between pointer-events-auto">
        <div className="text-xs text-text font-subtitle font-bold italic">TEST GRATIS</div>
        <a href="#quiz" className="px-6 py-2 bg-primary text-bg font-subtitle font-bold rounded-lg text-xs">
          INICIAR
        </a>
      </div>
    </motion.div>
  );
}
