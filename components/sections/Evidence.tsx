'use client';

import { motion } from 'framer-motion';

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="science" className="py-24 px-6 bg-bg overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-title mb-6 italic text-primary">
            Basado en evidencia científica
          </h2>
          <p className="text-lg text-text-muted font-body max-w-3xl mx-auto leading-relaxed">
            Estudios muestran que los pulsos binaurales inducen sincronización cerebral, asociados a procesos de regulación del estrés, mejora del sueño y atención sostenida.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {studies.map((study, index) => (
            <motion.div 
              key={study.title}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 0 40px rgba(120, 232, 248, 0.3)',
                transition: { duration: 0.3 } 
              }}
              className="p-8 rounded-3xl bg-bg-secondary border border-primary/40 relative overflow-hidden group"
              style={{
                boxShadow: '0 0 20px rgba(120, 232, 248, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-subtitle font-bold text-primary mb-6">
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
