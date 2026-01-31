'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight, Mail } from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/constants';
import { ARCHETYPES_FULL, type ArchetypeId } from '@/lib/quiz-logic';

type Lead = {
  id: string;
  email: string;
  answers: unknown;
  archetype: string;
  createdAt: Date;
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const answersRecord = (answers: unknown): Record<string, string> => {
    if (answers && typeof answers === 'object' && !Array.isArray(answers)) {
      return answers as Record<string, string>;
    }
    return {};
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-20 border border-white/10 rounded-xl bg-white/5">
        <p className="text-text-muted font-body">Aún no hay leads</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 font-subtitle text-primary text-xs tracking-widest uppercase w-8" />
              <th className="text-left py-4 px-6 font-subtitle text-primary text-xs tracking-widest uppercase">
                Email
              </th>
              <th className="text-left py-4 px-6 font-subtitle text-primary text-xs tracking-widest uppercase">
                Resultado
              </th>
              <th className="text-left py-4 px-6 font-subtitle text-primary text-xs tracking-widest uppercase">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isExpanded = expandedId === lead.id;
              const answers = answersRecord(lead.answers);
              const archetypeDisplay = ARCHETYPES_FULL[lead.archetype as ArchetypeId]?.title ?? lead.archetype;

              return (
                <Fragment key={lead.id}>
                  <tr
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-6">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                        className="p-1 rounded text-text-muted hover:text-primary transition-colors"
                        aria-label={isExpanded ? 'Cerrar respuestas' : 'Ver respuestas'}
                      >
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-6 font-body text-text flex items-center gap-2">
                      <Mail size={16} className="text-primary shrink-0" />
                      {lead.email}
                    </td>
                    <td className="py-3 px-6 font-body text-text-muted">
                      {archetypeDisplay}
                    </td>
                    <td className="py-3 px-6 font-body text-text-secondary text-sm">
                      {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-bg border-b border-white/10">
                      <td colSpan={4} className="py-4 px-6">
                        <div className="pl-6 border-l-2 border-primary/30">
                          <p className="font-subtitle text-primary text-xs tracking-widest mb-3 uppercase">
                            Respuestas por pregunta
                          </p>
                          <ul className="space-y-2 font-body text-sm text-text-muted">
                            {QUIZ_QUESTIONS.map((q, i) => {
                              const key = `p${i + 1}`;
                              const letter = answers[key] ?? '—';
                              const optionText =
                                letter === 'A' ? q.a : letter === 'B' ? q.b : letter === 'C' ? q.c : null;
                              return (
                                <li key={key} className="flex gap-3">
                                  <span className="font-subtitle text-primary shrink-0 w-8">
                                    {key.toUpperCase()}:
                                  </span>
                                  <span className="text-primary font-bold shrink-0">{letter}</span>
                                  {optionText && (
                                    <span className="text-text-muted line-clamp-2">{optionText}</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
