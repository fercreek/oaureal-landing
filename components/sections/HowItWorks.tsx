'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Package, Headphones } from 'lucide-react';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { itemVariants } from '@/lib/animations';

const steps = [
  {
    title: 'Realiza el Test Oaureal',
    duration: '3 min',
    description: 'Breve evaluación de tu estado actual y necesidades de regulación.',
    icon: MessageCircle,
  },
  {
    title: 'Recibe tu protocolo personalizado',
    duration: 'En tu correo',
    description: 'Audios y guía ajustados a tu perfil exacto.',
    icon: Package,
  },
  {
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
        palatino
      />

      <div className="flex flex-col gap-12 max-w-md mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <Icon className="w-8 h-8 text-primary mb-6" strokeWidth={2} />
              <h3 className="text-xl font-title font-bold text-text mb-1">
                {index + 1}. {step.title}
              </h3>
              <p className="text-sm text-primary font-subtitle font-semibold mb-4">
                {step.duration}
              </p>
              <p className="text-text-muted font-body text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
