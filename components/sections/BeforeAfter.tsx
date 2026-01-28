'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Battery, Brain, Moon, ArrowDown, Sparkles, Focus, Heart, Zap } from 'lucide-react';
import Section from '@/components/ui/Section';
import Grid from '@/components/ui/Grid';
import { containerVariants } from '@/lib/animations';

const beforeItems = [
  { text: 'Cansancio constante', icon: Battery },
  { text: 'Estrés acumulado', icon: AlertCircle },
  { text: 'Distracción y fatiga', icon: Brain },
  { text: 'Sueño interrumpido', icon: Moon },
];

const afterItems = [
  { text: 'Descanso profundo', icon: Moon },
  { text: 'Enfoque sostenido', icon: Focus },
  { text: 'Calma y claridad', icon: Heart },
  { text: 'Recuperación real', icon: Zap },
];

export default function BeforeAfter() {
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } 
    }
  };

  return (
    <Section maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-2xl px-10 py-5 border border-red-500/30">
            <p className="text-lg font-subtitle tracking-widest text-red-400 text-center font-bold">
              BEFORE
            </p>
            <motion.div 
              className="relative w-16 h-8 rounded-full bg-red-500/30 mt-3 mx-auto"
              animate={{ boxShadow: ['0 0 10px rgba(239,68,68,0.3)', '0 0 20px rgba(239,68,68,0.5)', '0 0 10px rgba(239,68,68,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-400 shadow-lg" />
            </motion.div>
          </div>
        </motion.div>

        <Grid
          cols={{ base: 2, md: 4 }}
          gap="sm"
          className="mb-12"
        >
          {beforeItems.map((item, index) => (
            <motion.div
              key={item.text}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 } 
              }}
              className="p-6 rounded-2xl bg-bg-secondary/50 border border-red-500/30 text-center hover:border-red-400/60 transition-all group"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center"
              >
                <item.icon size={24} className="text-red-400 group-hover:text-red-300 transition-colors" />
              </motion.div>
              <span className="text-base font-subtitle text-text-muted group-hover:text-text transition-colors">
                {item.text}
              </span>
            </motion.div>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center my-8"
        >
          <div className="w-px h-16 bg-gradient-to-b from-red-500/50 via-primary/50 to-primary" />
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={32} className="text-primary my-2" />
          </motion.div>
          <div className="w-px h-16 bg-gradient-to-b from-primary to-primary/50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-2xl px-10 py-5 border border-primary/50 shadow-[0_0_30px_rgba(120,232,248,0.2)]">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <p className="text-lg font-subtitle tracking-widest text-primary text-center font-bold">
                AFTER
              </p>
              <Sparkles size={18} className="text-primary" />
            </div>
            <motion.div 
              className="relative w-16 h-8 rounded-full bg-primary mt-3 mx-auto"
              animate={{ boxShadow: ['0 0 15px var(--color-primary)', '0 0 30px var(--color-primary)', '0 0 15px var(--color-primary)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl font-body text-text mt-8 text-center"
          >
            Con un protocolo personalizado y uso constante:
          </motion.p>
        </motion.div>

        <Grid
          cols={{ base: 2, md: 4 }}
          gap="sm"
        >
          {afterItems.map((item, index) => (
            <motion.div
              key={item.text}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: '0 0 40px rgba(120, 232, 248, 0.4)',
                transition: { duration: 0.2 } 
              }}
              className="p-6 rounded-2xl bg-primary/5 border border-primary text-center shadow-[0_0_20px_rgba(120,232,248,0.2)] transition-all group"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <item.icon size={24} className="text-primary group-hover:text-primary-light transition-colors" />
              </motion.div>
              <span className="text-base font-subtitle text-primary font-semibold">
                {item.text}
              </span>
            </motion.div>
          ))}
        </Grid>
    </Section>
  );
}
