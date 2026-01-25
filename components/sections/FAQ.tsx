'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/constants';

export default function FAQ() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-title mb-10 italic text-primary">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className="border-b border-white/10">
              <button 
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-primary transition-colors"
              >
                <span className="font-title text-lg text-text">{faq.q}</span>
                <ChevronRight className={`transition-transform text-text-muted ${faqOpen === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-text-muted text-sm leading-relaxed font-body">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
