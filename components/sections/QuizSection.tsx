'use client';

import { useState } from 'react';
import Quiz from '@/components/features/Quiz';
import type { QuizCompletePayload } from '@/components/features/Quiz';
import QuizResultsView from '@/components/features/QuizResults';
import { type ArchetypeId, type ArchetypeIndicators } from '@/lib/quiz-logic';

interface QuizSectionProps {
  onResult?: (archetype: string) => void;
}

export default function QuizSection({ onResult }: QuizSectionProps) {
  const [result, setResult] = useState<ArchetypeId | null>(null);
  const [indicadores, setIndicadores] = useState<ArchetypeIndicators | null>(null);

  const handleComplete = (payload: QuizCompletePayload) => {
    setResult(payload.archetype as ArchetypeId);
    setIndicadores(payload.indicadores);
    onResult?.(payload.archetype);
  };

  return (
    <section id="quiz" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        {!result ? (
          <Quiz onComplete={handleComplete} />
        ) : (
          <QuizResultsView archetype={result} indicadores={indicadores} />
        )}
      </div>
    </section>
  );
}
