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

export async function submitQuiz(
  email: string,
  answers: Record<string, string>
): Promise<SubmitQuizResult> {
  const trimmed = email?.trim();
  if (!trimmed || !trimmed.includes('@')) {
    return { ok: false, error: 'Email inválido' };
  }
  const keys = Object.keys(answers).sort();
  const required = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];
  if (keys.length < 10 || required.some((k) => !(k in answers))) {
    return { ok: false, error: 'Faltan respuestas' };
  }
  const porcentajes = calcularPerfilOndas(answers);
  const archetype = identificarArquetipo(porcentajes) as ArchetypeId;
  const indicadores = calcularIndicadoresDinamicos(answers, archetype);
  await prisma.quizSubmission.create({
    data: {
      email: trimmed,
      answers: answers as object,
      archetype,
    },
  });
  return { ok: true, archetype, indicadores };
}

export async function deleteQuizSubmission(id: string) {
  await requireAuth();
  await prisma.quizSubmission.delete({ where: { id } });
  revalidatePath('/admin/leads');
  revalidatePath('/admin/dashboard');
}
