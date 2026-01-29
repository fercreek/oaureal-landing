'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Package, Headphones } from 'lucide-react';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { itemVariants } from '@/lib/animations';

const steps = [
  {
    number: '01',
    title: 'Realiza el Test Oaureal',
    duration: '~5 min gratis',
    description: 'Breve evaluación de tu estado actual y necesidades de regulación.',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'Recibe tu protocolo personalizado',
    duration: 'En tu correo',
    description: 'Audios y guía ajustados a tu perfil exacto.',
    icon: Package,
  },
  {
    number: '03',
    title: 'Escucha y entrena',
    duration: 'Cuando quieras',
    description: 'Audífonos, volumen bajo, constancia. Cambios progresivos en calma, enfoque y descanso con uso constante.',
    icon: Headphones,
  },
];

export default function HowItWorks() {
  return (
    <Section maxWidth="md">
      <SectionTitle
        title="Cómo funciona Oaureal"
        subtitle="Un proceso simple y transparente de inicio a fin"
        useSimpleAnimation
      />

      <div className="flex flex-col gap-12 max-w-md mx-auto">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl bg-bg-secondary/90 backdrop-blur-sm border border-primary/40 p-8 shadow-[0_0_30px_rgba(120,232,248,0.08)] hover:border-primary/60 hover:shadow-[0_0_40px_var(--color-primary)] transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-primary border-2 border-bg flex items-center justify-center shadow-[0_0_20px_var(--color-primary)]">
                  <span className="text-bg font-subtitle font-bold text-sm">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-title font-bold text-text mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-primary font-subtitle font-semibold mb-4">
                    {step.duration}
                  </p>
                  <p className="text-text-muted font-body text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
