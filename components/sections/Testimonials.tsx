'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';

const testimonials = [
  {
    name: 'Carlos R.',
    age: 28,
    role: 'Freelancer creativo',
    quote: 'Tenía problemas para concentrarme y terminar proyectos. Los audios binaurales me ayudan a entrar en flujo y sostener la atención por más tiempo sin sentirme agotado.',
  },
  {
    name: 'Paula F.',
    age: 34,
    role: 'Emprendedora',
    quote: 'Los audios me guían hacia un estado de calma y claridad que antes parecía imposible.',
  },
  {
    name: 'Luis T.',
    age: 35,
    role: 'Programador',
    quote: 'Me sorprendió lo personalizado que es. Cada audio se siente hecho para mí. Mis noches de sueño profundo mejoraron después de unas semanas.',
  },
];

const ROTATE_MS = 6000;

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[index];

  return (
    <Section maxWidth="lg">
      <SectionTitle
        title="Lo que dicen quienes experimentan OAUREAL"
        useSimpleAnimation
      />

      <div className="relative min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <Card
              variant="highlighted"
              glow
              hover={false}
              className="max-w-3xl mx-auto text-center shadow-[0_0_40px_var(--color-primary)]"
            >
              <h3 className="text-xl font-subtitle font-bold text-primary mb-4">
                {t.name}, {t.age} años – {t.role}
              </h3>
              <p className="text-text font-body italic leading-relaxed">
                &quot;{t.quote}&quot;
              </p>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ver testimonio ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index
                ? 'bg-primary scale-125 shadow-[0_0_12px_var(--color-primary)]'
                : 'bg-primary/40 hover:bg-primary/60'
            }`}
          />
        ))}
      </div>
    </Section>
  );
}
