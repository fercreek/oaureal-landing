'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_MOTIVATION_CARDS, ARCHETYPES } from '@/lib/constants';

interface QuizProps {
  onComplete: (result: keyof typeof ARCHETYPES) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [started, setStarted] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState<typeof QUIZ_MOTIVATION_CARDS[0] | null>(null);

  const handleAnswer = (val: string) => {
    const newResponses = [...responses, val];
    setResponses(newResponses);
    
    const motivationCard = QUIZ_MOTIVATION_CARDS.find(card => card.afterQuestion === step + 1);
    
    if (motivationCard) {
      setCurrentMotivation(motivationCard);
      setShowMotivation(true);
    } else {
      proceedToNextQuestion(newResponses);
    }
  };

  const proceedToNextQuestion = (newResponses: string[]) => {
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

  const handleContinueFromMotivation = () => {
    setShowMotivation(false);
    setCurrentMotivation(null);
    proceedToNextQuestion(responses);
  };

  if (!started) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-10 md:p-12 rounded-3xl bg-bg-secondary border border-white/10"
      >
        <h3 className="text-3xl md:text-4xl font-subtitle font-bold text-white mb-6 text-center">
          Haz el test gratis
        </h3>
        <p className="text-text font-bold text-center mb-2 leading-relaxed">
          En solo 3 minutos descubre cómo está funcionando tu sistema mental hoy y qué necesita para sentirse en calma, enfocado o descansado.
        </p>
        <p className="text-text font-bold text-center mb-8">
          No es un diagnóstico. Es una guía clara para entender tu estado actual.
        </p>
        <input 
          type="email" 
          placeholder="tu@email.com"
          className="w-full p-4 bg-bg border border-white/20 rounded-xl mb-4 text-text-muted outline-none focus:border-primary transition-colors font-body"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          disabled={!email.includes('@')}
          onClick={() => setStarted(true)}
          className="w-full py-4 bg-primary/60 text-bg font-subtitle font-bold rounded-xl hover:bg-primary/80 disabled:opacity-30 transition-all"
        >
          INICIA
        </button>
      </motion.div>
    );
  }

  if (showMotivation && currentMotivation) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="motivation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-primary-dark/20 border border-primary/30 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Sparkles size={32} className="text-primary" />
            </motion.div>
            <h4 className="text-xl font-subtitle font-bold text-primary mb-4">
              {currentMotivation.title}
            </h4>
            <p className="text-text-muted font-body leading-relaxed mb-8">
              {currentMotivation.text}
            </p>
            <button
              onClick={handleContinueFromMotivation}
              className="px-8 py-3 bg-primary text-bg font-subtitle font-bold rounded-xl hover:bg-primary-light transition-all"
            >
              Continuar
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="w-full bg-white/10 h-2 mb-8 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary-dark to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[350px]"
        >
          <p className="text-primary text-xs font-subtitle tracking-widest mb-2">
            PREGUNTA {step + 1} DE {QUIZ_QUESTIONS.length}
          </p>
          <h4 className="text-2xl text-white mb-8 font-title">
            {QUIZ_QUESTIONS[step].q}
          </h4>
          
          <div className="space-y-3">
            {['A', 'B', 'C'].map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(opt)}
                className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 transition-all text-text-muted font-body group"
              >
                <span className="inline-block w-10 font-bold text-primary group-hover:text-primary-light">
                  {opt})
                </span>
                {QUIZ_QUESTIONS[step][opt.toLowerCase() as 'a' | 'b' | 'c']}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
