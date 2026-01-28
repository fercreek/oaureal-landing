'use client';

import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Grid from '@/components/ui/Grid';
import { itemVariants } from '@/lib/animations';

const steps = [
  {
    number: '1',
    title: 'Realiza el Test Oaureal',
    description: 'Breve evaluación de tu estado actual y necesidades de regulación.',
  },
  {
    number: '2',
    title: 'Recibe tu protocolo personalizado',
    description: 'Audios y guía ajustados a tu perfil exacto.',
  },
  {
    number: '3',
    title: 'Escucha y entrena',
    description: 'Audífonos, volumen bajo, constancia. Cambios progresivos en calma, enfoque y descanso con uso constante.',
  },
];

export default function HowItWorks() {
  return (
    <Section maxWidth="md">
      <SectionTitle 
        title="Cómo funciona Oaureal"
        subtitle="Tres pasos simples para entrenar tu mente:"
        useSimpleAnimation
      />

      <Grid cols={{ base: 1, md: 3 }} gap="md">
        {steps.map((step) => (
          <Card
            key={step.number}
            variant="default"
            glow
            variants={itemVariants}
            className="rounded-2xl border-primary/50 hover:border-primary hover:shadow-[0_0_20px_var(--color-primary)]"
          >
            <h3 className="text-2xl font-subtitle font-bold text-primary mb-4">
              {step.number}.{step.title}
            </h3>
            <p className="text-text-muted font-body leading-relaxed">
              {step.description}
            </p>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
