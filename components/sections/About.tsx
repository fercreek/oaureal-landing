'use client';

import { motion } from 'framer-motion';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Grid from '@/components/ui/Grid';
import { cardVariants } from '@/lib/animations';

export default function About() {
  const cards = [
    {
      title: "OAUREAL: ENTRENAMIENTO CONSCIENTE DE TU MENTE",
      content: [
        "No es música para distraerte.",
        "No es meditación pasiva.",
        "Es un entrenamiento sonoro que ayuda a tu cerebro a entrar en estados funcionales como calma, enfoque o descanso profundo."
      ],
      highlighted: false
    },
    {
      title: "QUÉ SON LOS BINAURALES",
      content: [
        "Dos tonos ligeramente distintos en cada oído.",
        "El cerebro genera una tercera frecuencia (frecuencia binaural) que ayuda a sincronizar tus ondas cerebrales.",
        "Esto potencia tu atención, regulación emocional y descanso."
      ],
      highlighted: true
    },
    {
      title: "POR QUÉ OAUREAL ES DIFERENTE",
      content: [
        "Audios en WAV, sin compresión, señal limpia y precisa.",
        "Entrenamiento consciente, no consumo pasivo.",
        "Diferencia clara: YouTube/Spotify = música; Oaureal = entrenamiento cerebral real."
      ],
      highlighted: false
    }
  ];

  return (
    <Section id="about" maxWidth="lg">
      <SectionTitle 
        title="QUÉ ES OAUREAL" 
        showDivider 
      />
      
      <Grid 
        cols={{ base: 1, md: 3 }} 
        gap="lg"
        className="items-stretch"
      >
        {cards.map((card, index) => (
          <Card
            key={index}
            variant={card.highlighted ? 'highlighted' : 'default'}
            glow={card.highlighted}
            variants={cardVariants}
            className="h-full"
            whileHover={{ 
              y: -10, 
              boxShadow: card.highlighted 
                ? '0 0 60px var(--color-primary)' 
                : '0 0 30px var(--color-primary)',
              transition: { duration: 0.3 } 
            }}
            style={{
              boxShadow: card.highlighted 
                ? '0 0 40px var(--color-primary)' 
                : '0 0 20px rgba(120, 232, 248, 0.1), inset 0 1px 0 0 rgba(255,255,255,0.05)'
            }}
          >
            <h3 className={`text-lg font-subtitle font-bold text-center mb-8 uppercase tracking-wide ${
              card.highlighted ? 'text-primary' : 'text-text'
            }`}>
              {card.title}
            </h3>
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {card.content.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-center leading-relaxed font-body text-text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
