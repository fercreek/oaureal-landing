'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import Quiz from '@/components/features/Quiz';
import AudioPreview from '@/components/features/AudioPreview';
import { ARCHETYPES, getAudioByArchetype } from '@/lib/constants';

interface QuizSectionProps {
  onResult?: (result: keyof typeof ARCHETYPES) => void;
}

export default function QuizSection({ onResult }: QuizSectionProps) {
  const [result, setResult] = useState<keyof typeof ARCHETYPES | null>(null);

  const handleComplete = (res: keyof typeof ARCHETYPES) => {
    setResult(res);
    onResult?.(res);
  };

  return (
    <section id="quiz" className="py-24 px-6 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        {!result ? (
          <Quiz onComplete={handleComplete} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div 
              className="inline-block p-10 rounded-full mb-10 relative"
              style={{ backgroundColor: ARCHETYPES[result].aura, boxShadow: `0 0 60px ${ARCHETYPES[result].aura}` }}
            >
              <Brain size={80} color="white" />
            </div>
            <p className="text-[#a5f0fa] tracking-[0.3em] font-bold text-sm mb-4">RESULTADO OBTENIDO</p>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 italic text-white">{ARCHETYPES[result].title}</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg">
              {ARCHETYPES[result].description}
            </p>
            
            <div className="max-w-sm mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-12">
              <div className="flex justify-between mb-4 text-xs font-mono tracking-widest text-[#a5f0fa]">
                <span>ESTADO: {ARCHETYPES[result].wave}</span>
                <span>INTENSIDAD: ALTA</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full mb-8">
                <div className="h-full bg-[#a5f0fa] w-3/4 rounded-full" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="text-center mb-8">
                <p className="text-[#a5f0fa] tracking-[0.3em] font-bold text-sm mb-2">AUDIO SUGERIDO</p>
                <h3 className="text-2xl font-serif text-white mb-4">Basado en tu diagnóstico</h3>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                  Hemos seleccionado un protocolo de audio específico para tu estado actual. Prueba el preview a continuación.
                </p>
              </div>

              {(() => {
                const suggestedAudio = getAudioByArchetype(result);
                return (
                  <AudioPreview
                    name={suggestedAudio.name}
                    frequency={suggestedAudio.frequency}
                    duration={suggestedAudio.duration}
                    description={suggestedAudio.description}
                    color={suggestedAudio.color}
                    binauralFreq={suggestedAudio.binauralFreq}
                  />
                );
              })()}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button className="px-10 py-4 bg-[#a5f0fa] text-black font-bold rounded-xl shadow-[0_0_20px_#a5f0fa] hover:scale-105 transition-all">
                CONSEGUIR MI PLAN COMPLETO
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Accede a todos los protocolos de audio y personaliza tu entrenamiento
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
