'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  calcularPerfilOndas,
  calcularIndicadoresDinamicos,
  identificarArquetipo,
  type ArchetypeId,
  type ArchetypeIndicators,
} from '@/lib/quiz-logic';

export type SubmitQuizResult =
  | { ok: true; archetype: string; indicadores: ArchetypeIndicators }
  | { ok: false; error: string };

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_EMAIL_LENGTH = 254;
const REQUIRED_QUESTIONS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'] as const;
const ALLOWED_ANSWERS = new Set(['A', 'B', 'C']);

export async function submitQuiz(
  email: string,
  answers: Record<string, string>,
  honeypot?: string
): Promise<SubmitQuizResult> {
  if (honeypot && honeypot.trim().length > 0) {
    return { ok: true, archetype: 'analitico', indicadores: {} as ArchetypeIndicators };
  }

  const trimmed = (email ?? '').trim();
  if (!trimmed || trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(trimmed)) {
    return { ok: false, error: 'Email inválido' };
  }

  if (!answers || typeof answers !== 'object') {
    return { ok: false, error: 'Respuestas inválidas' };
  }
  for (const key of REQUIRED_QUESTIONS) {
    const value = answers[key];
    if (typeof value !== 'string' || !ALLOWED_ANSWERS.has(value)) {
      return { ok: false, error: 'Respuestas inválidas' };
    }
  }
  const sanitized: Record<string, string> = {};
  for (const key of REQUIRED_QUESTIONS) {
    sanitized[key] = answers[key];
  }

  const porcentajes = calcularPerfilOndas(sanitized);
  const archetype = identificarArquetipo(porcentajes) as ArchetypeId;
  const indicadores = calcularIndicadoresDinamicos(sanitized, archetype);
  await prisma.quizSubmission.create({
    data: {
      email: trimmed.toLowerCase(),
      answers: sanitized as object,
      archetype,
    },
  });
  return { ok: true, archetype, indicadores };
}

export async function deleteQuizSubmission(id: string) {
  await requireAuth();
  if (typeof id !== 'string' || id.length === 0 || id.length > 64) {
    throw new Error('ID inválido');
  }
  await prisma.quizSubmission.delete({ where: { id } });
  revalidatePath('/admin/leads');
  revalidatePath('/admin/dashboard');
}
