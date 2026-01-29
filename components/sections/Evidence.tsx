'use client';

import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Grid from '@/components/ui/Grid';
import { itemVariants } from '@/lib/animations';

const studies = [
  {
    title: 'Regulación del estrés',
    finding: 'Activación del sistema nervioso parasimpático (relajación).',
    reference: 'Yang SY, et al. (2025). BMC Complement Med Ther. PMID: 40483455.',
  },
  {
    title: 'Mejora del sueño',
    finding: 'Aceleración del sueño profundo y reducción del tiempo para dormirse.',
    reference: 'Fan Z, et al. (2024). Sci Rep. PMID: 39478090.',
  },
  {
    title: 'Enfoque y atención',
    finding: 'Potencian la concentración y agudizan la atención para evitar distracciones.',
    reference: 'Colzato LS, et al. (2017). Psychol Res. PMID: 26612201.',
  },
];

export default function Evidence() {
  return (
    <Section id="science" maxWidth="lg">
      <SectionTitle 
        title="Basado en evidencia científica"
        subtitle="Estudios muestran que los pulsos binaurales inducen sincronización cerebral, asociados a procesos de regulación del estrés, mejora del sueño y atención sostenida."
        useSimpleAnimation
      />
      
      <Grid cols={{ base: 1, md: 3 }} gap="md">
        {studies.map((study) => (
          <Card
            key={study.title}
            variant="default"
            glow
            variants={itemVariants}
            className="relative overflow-hidden group"
            whileHover={{ 
              y: -10, 
              boxShadow: '0 0 40px rgba(120, 232, 248, 0.3)',
              transition: { duration: 0.3 } 
            }}
            style={{
              boxShadow: '0 0 20px rgba(120, 232, 248, 0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-title font-bold text-primary mb-6">
                {study.title}
              </h3>
              <p className="text-text font-body mb-6 leading-relaxed">
                <span className="text-primary font-semibold">Hallazgo:</span> {study.finding}
              </p>
              <div className="flex gap-3 pt-4 border-t border-primary/20">
                <div className="w-1 bg-primary shrink-0 rounded-full" />
                <p className="text-xs text-text-muted/80 font-body">
                  Referencia: {study.reference}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
