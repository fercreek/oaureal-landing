'use client';

import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Grid from '@/components/ui/Grid';
import { itemVariants } from '@/lib/animations';

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

export default function Testimonials() {
  return (
    <Section maxWidth="lg">
      <SectionTitle 
        title="Lo que dicen quienes experimentan OAUREAL"
        useSimpleAnimation
      />

      <Grid cols={{ base: 1, md: 2 }} gap="md">
        <Card
          variant="gradient"
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="shadow-[0_0_30px_rgba(120,232,248,0.1)]"
        >
          <h3 className="text-xl font-subtitle font-bold text-white mb-4">
            {testimonials[0].name}, {testimonials[0].age} años – {testimonials[0].role}
          </h3>
          <p className="text-text font-body italic leading-relaxed">
            &quot;{testimonials[0].quote}&quot;
          </p>
        </Card>

        <Card
          variant="gradient"
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="shadow-[0_0_30px_rgba(120,232,248,0.1)] flex flex-col justify-center"
        >
          <h3 className="text-xl font-subtitle font-bold text-white mb-4">
            {testimonials[1].name}, {testimonials[1].age} años – {testimonials[1].role}
          </h3>
          <p className="text-text font-body italic leading-relaxed">
            &quot;{testimonials[1].quote}&quot;
          </p>
        </Card>
      </Grid>

      <div className="mt-6 flex justify-center">
        <Card
          variant="gradient"
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="md:w-2/3 text-center shadow-[0_0_30px_rgba(120,232,248,0.1)]"
        >
          <h3 className="text-xl font-subtitle font-bold text-white mb-4">
            {testimonials[2].name}, {testimonials[2].age} años – {testimonials[2].role}
          </h3>
          <p className="text-text font-body italic leading-relaxed">
            &quot;{testimonials[2].quote}&quot;
          </p>
        </Card>
      </div>
    </Section>
  );
}
