'use client';

import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="about" className="py-24 px-6 bg-bg overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-title text-primary italic">
            QUÉ ES OAUREAL
          </h2>
          <div className="w-48 h-0.5 bg-primary mx-auto mt-4" />
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: card.highlighted 
                  ? '0 0 60px var(--color-primary)' 
                  : '0 0 30px var(--color-primary)',
                transition: { duration: 0.3 } 
              }}
              className={`rounded-3xl p-8 flex flex-col h-full transition-all duration-300 bg-bg-secondary/80 backdrop-blur-sm ${
                card.highlighted
                  ? 'border-2 border-primary shadow-[0_0_40px_var(--color-primary)]'
                  : 'border border-primary/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
              }`}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
