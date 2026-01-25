'use client';

import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-bg">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-title mb-8 italic text-primary">¿Qué es Oaureal?</h2>
          <p className="text-text-muted text-lg font-body leading-relaxed mb-6">
            Oaureal es una plataforma de entrenamiento cerebral a través del sonido. No es música para distraerte ni meditación pasiva.
          </p>
          <p className="text-text-muted text-lg font-body leading-relaxed mb-10">
            Utilizamos frecuencias auditivas específicas para ayudar a tu cerebro a entrar en estados funcionales como calma, presencia, enfoque o descanso profundo.
          </p>
          <div className="space-y-4">
            {[
              "No es meditación pasiva",
              "Es entrenamiento consciente",
              "Tecnología Brainwave Entrainment"
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-primary">
                <CheckCircle size={18} />
                <span className="text-sm font-subtitle font-bold uppercase tracking-wider">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative p-1 bg-gradient-to-tr from-primary to-primary-dark rounded-[40px]">
          <div className="bg-bg rounded-[38px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800" 
              alt="Neural patterns" 
              className="opacity-50 hover:scale-110 transition-transform duration-1000"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
