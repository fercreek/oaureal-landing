'use client';

import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Moon, Target, Zap } from 'lucide-react';

export default function Evidence() {
  return (
    <section id="science" className="py-24 px-6 bg-bg overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-title mb-4 italic text-primary">Basado en evidencia científica</h2>
          <p className="text-text-muted font-body">Neurociencia aplicada a la salud mental</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "97%", sub: "Relajación inmediata", icon: <Brain /> },
            { title: "91%", sub: "Menos ansiedad", icon: <ShieldCheck /> },
            { title: "84%", sub: "Mente en calma", icon: <Moon /> },
            { title: "Flow", sub: "Alto rendimiento", icon: <Target /> }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center"
            >
              <div className="mb-4 flex justify-center text-primary opacity-50">{stat.icon}</div>
              <h3 className="text-4xl font-bold text-text mb-2">{stat.title}</h3>
              <p className="text-xs text-text-secondary uppercase tracking-widest font-subtitle">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-gradient-to-br from-primary/20 to-primary-dark/20 border border-white/5 backdrop-blur-3xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h4 className="text-2xl font-title mb-6 text-primary">Brainwave Entrainment</h4>
              <p className="text-text-muted leading-relaxed mb-6 italic font-body">
                "La investigación en neurociencia auditiva ha demostrado que los pulsos binaurales pueden inducir entrainment cerebral, sincronizando la actividad eléctrica con estímulos externos."
              </p>
              <div className="flex gap-4">
                <div className="h-10 w-1 bg-primary" />
                <p className="text-xs text-text-secondary font-body">
                  Referencia: Lane, J. D., et al. (1998). Physiology & Behavior.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {['Regulación del cortisol nocturno', 'Activación sistema parasimpático', 'Atención sostenida'].map(item => (
                <div key={item} className="p-4 bg-bg/40 rounded-xl border border-white/5 flex items-center gap-3">
                  <Zap size={16} className="text-primary" />
                  <span className="text-sm font-light text-text-muted font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
