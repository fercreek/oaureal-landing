'use client';

import { motion } from 'framer-motion';

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
    <section className="py-24 px-6 bg-bg overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-title text-primary italic">
            Lo que dicen quienes experimentan OAUREAL
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="p-8 rounded-3xl bg-gradient-to-br from-bg-deep/80 to-secondary/40 border border-primary/20 shadow-[0_0_30px_rgba(120,232,248,0.1)]"
          >
            <h3 className="text-xl font-subtitle font-bold text-white mb-4">
              {testimonials[0].name}, {testimonials[0].age} años – {testimonials[0].role}
            </h3>
            <p className="text-text font-body italic leading-relaxed">
              &quot;{testimonials[0].quote}&quot;
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="p-8 rounded-3xl bg-gradient-to-br from-bg-deep/80 to-secondary/40 border border-primary/20 shadow-[0_0_30px_rgba(120,232,248,0.1)] flex flex-col justify-center"
          >
            <h3 className="text-xl font-subtitle font-bold text-white mb-4">
              {testimonials[1].name}, {testimonials[1].age} años – {testimonials[1].role}
            </h3>
            <p className="text-text font-body italic leading-relaxed">
              &quot;{testimonials[1].quote}&quot;
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-6 flex justify-center"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="p-8 rounded-3xl bg-gradient-to-br from-bg-deep/80 to-secondary/40 border border-primary/20 shadow-[0_0_30px_rgba(120,232,248,0.1)] md:w-2/3 text-center"
          >
            <h3 className="text-xl font-subtitle font-bold text-white mb-4">
              {testimonials[2].name}, {testimonials[2].age} años – {testimonials[2].role}
            </h3>
            <p className="text-text font-body italic leading-relaxed">
              &quot;{testimonials[2].quote}&quot;
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
