/**
 * Verificación de la lógica del quiz (lib/quiz-logic.ts).
 * Documentación: docs/quiz-logic.md
 */

import {
  MATRIZ_PESOS,
  calcularPerfilOndas,
  identificarArquetipo,
} from '../lib/quiz-logic';

const allA: Record<string, string> = {
  p1: 'A', p2: 'A', p3: 'A', p4: 'A', p5: 'A',
  p6: 'A', p7: 'A', p8: 'A', p9: 'A', p10: 'A',
};
const allB: Record<string, string> = {
  p1: 'B', p2: 'B', p3: 'B', p4: 'B', p5: 'B',
  p6: 'B', p7: 'B', p8: 'B', p9: 'B', p10: 'B',
};
const allC: Record<string, string> = {
  p1: 'C', p2: 'C', p3: 'C', p4: 'C', p5: 'C',
  p6: 'C', p7: 'C', p8: 'C', p9: 'C', p10: 'C',
};

console.log('=== Verificación lógica del quiz (lib/quiz-logic.ts) ===\n');

console.log('1. Matriz de pesos p1-p10 A/B/C:');
let ok = true;
const ref: Record<string, Record<string, { delta: number; theta: number; alpha: number; beta: number; gamma: number }>> = {
  p1: { A: { delta: 20, theta: 5, alpha: 3, beta: 1, gamma: 0 }, B: { delta: 3, theta: 20, alpha: 5, beta: 2, gamma: 1 }, C: { delta: 2, theta: 3, alpha: 12, beta: 15, gamma: 5 } },
  p2: { A: { delta: 25, theta: 3, alpha: 2, beta: 0, gamma: 0 }, B: { delta: 5, theta: 18, alpha: 8, beta: 3, gamma: 1 }, C: { delta: 8, theta: 5, alpha: 10, beta: 12, gamma: 3 } },
  p10: { A: { delta: 22, theta: 8, alpha: 3, beta: 1, gamma: 0 }, B: { delta: 4, theta: 24, alpha: 6, beta: 2, gamma: 1 }, C: { delta: 2, theta: 4, alpha: 16, beta: 20, gamma: 10 } },
};
for (const p of ['p1', 'p2', 'p10'] as const) {
  for (const opt of ['A', 'B', 'C'] as const) {
    const ours = MATRIZ_PESOS[p]?.[opt];
    const orig = ref[p][opt];
    if (!ours || ours.delta !== orig.delta || ours.theta !== orig.theta || ours.alpha !== orig.alpha || ours.beta !== orig.beta || ours.gamma !== orig.gamma) {
      console.log(`  ERROR ${p} ${opt}: esperado`, orig, 'obtenido', ours);
      ok = false;
    }
  }
}
if (ok) console.log('  OK (muestra p1, p2, p10; resto igual en código)\n');

console.log('2. Perfil de ondas y arquetipo:');
const profileA = calcularPerfilOndas(allA);
const archetypeA = identificarArquetipo(profileA);
console.log('   Todas A -> perfil:', profileA, '-> arquetipo:', archetypeA);

const profileB = calcularPerfilOndas(allB);
const archetypeB = identificarArquetipo(profileB);
console.log('   Todas B -> perfil:', profileB, '-> arquetipo:', archetypeB);

const profileC = calcularPerfilOndas(allC);
const archetypeC = identificarArquetipo(profileC);
console.log('   Todas C -> perfil:', profileC, '-> arquetipo:', archetypeC);

const mixed: Record<string, string> = {
  p1: 'A', p2: 'B', p3: 'A', p4: 'B', p5: 'C',
  p6: 'A', p7: 'B', p8: 'A', p9: 'B', p10: 'C',
};
const profileMixed = calcularPerfilOndas(mixed);
const archetypeMixed = identificarArquetipo(profileMixed);
console.log('   Mixto A/B/C -> perfil:', profileMixed, '-> arquetipo:', archetypeMixed);

console.log('\n3. Reglas identificarArquetipo (orden y umbrales, ver docs/quiz-logic.md):');
console.log('   insomne: delta>=55, theta>=25, beta===0');
console.log('   exhausto: delta 35-50, theta>=20, beta 5-15');
console.log('   protector: theta>=50, delta<=20, beta<=10');
console.log('   ansioso: theta 35-45, beta 10-15');
console.log('   performer: beta>=30, alpha>=30, gamma>=8');
console.log('   disperso: alpha>=25, beta>=25, theta 15-25');
console.log('   quemado: delta>=30, theta>=25, alpha>=15, beta>=8');
console.log('   armonia: delta>=35, theta>=35, beta<=5');
console.log('   default: onda dominante -> insomne/protector/performer/disperso');

console.log('\n=== Verificación completada ===');
