'use client';

import { motion } from 'framer-motion';

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
    <section className="py-24 px-6 bg-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-title text-primary italic mb-4">
            Cómo funciona Oaureal
          </h2>
          <p className="text-lg text-text-muted font-body">
            Tres pasos simples para entrenar tu mente:
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="p-8 rounded-2xl border border-primary/50 hover:border-primary hover:shadow-[0_0_20px_var(--color-primary)] transition-all"
            >
              <h3 className="text-2xl font-subtitle font-bold text-primary mb-4">
                {step.number}.{step.title}
              </h3>
              <p className="text-text-muted font-body leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
