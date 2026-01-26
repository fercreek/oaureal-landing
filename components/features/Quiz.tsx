'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { QUIZ_QUESTIONS, ARCHETYPES } from '@/lib/constants';

interface QuizProps {
  onComplete: (result: keyof typeof ARCHETYPES) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [started, setStarted] = useState(false);

  const handleAnswer = (val: string) => {
    const newResponses = [...responses, val];
    setResponses(newResponses);
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const counts = newResponses.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) as keyof typeof ARCHETYPES;
      onComplete(winner);
    }
  };

  if (!started) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
      >
        <h3 className="text-2xl font-serif text-white mb-4">Diagnóstico Cerebral Express</h3>
        <p className="text-gray-400 mb-6">En solo 2 minutos descubre el estado actual de tu cerebro y qué necesita para sentirse en calma.</p>
        <input 
          type="email" 
          placeholder="tu@email.com"
          className="w-full p-4 bg-bg-secondary border border-white/10 rounded-xl mb-4 text-text outline-none focus:border-primary transition-colors font-body"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          disabled={!email.includes('@')}
          onClick={() => setStarted(true)}
          className="w-full py-4 bg-primary text-bg font-subtitle font-bold rounded-xl shadow-[0_0_20px_var(--color-primary)] hover:opacity-90 disabled:opacity-30 transition-all"
        >
          INICIA
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="w-full bg-white/10 h-1 mb-8 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary-dark to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[300px]"
        >
          <p className="text-primary text-xs font-subtitle tracking-widest mb-2">PREGUNTA {step + 1} DE {QUIZ_QUESTIONS.length}</p>
          <h4 className="text-2xl text-white mb-8 font-serif">{QUIZ_QUESTIONS[step].q}</h4>
          
          <div className="space-y-4">
            {['A', 'B', 'C'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary hover:bg-white/10 transition-all text-text-muted font-body"
              >
                <span className="inline-block w-8 font-bold text-primary">{opt})</span>
                {QUIZ_QUESTIONS[step][opt.toLowerCase() as 'a' | 'b' | 'c']}
              </button>
            ))}
          </div>

          {step % 3 === 0 && step !== 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs flex items-center gap-3 font-body"
            >
              <Info size={16} />
              Analizando patrones de ondas... Ya casi terminamos.
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
