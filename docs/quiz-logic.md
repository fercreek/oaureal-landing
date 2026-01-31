# Lógica del quiz Oaureal

Documentación de la lógica de diagnóstico del test de 10 preguntas: pesos por onda cerebral, cálculo del perfil, identificación del arquetipo e indicadores dinámicos.

**Código:** `lib/quiz-logic.ts`  
**Verificación:** `scripts/verify-quiz-weights.ts`

---

## Flujo general

1. El usuario responde 10 preguntas (p1–p10) con opción A, B o C.
2. Las respuestas se envían como `Record<string, string>` (ej. `{ p1: "A", p2: "B", ... }`).
3. **calcularPerfilOndas(answers)** suma los pesos por onda y devuelve porcentajes (delta, theta, alpha, beta, gamma).
4. **identificarArquetipo(porcentajes)** aplica reglas por umbrales y devuelve uno de 8 arquetipos.
5. **calcularIndicadoresDinamicos(answers, archetypeId)** devuelve 3 indicadores dinámicos según el arquetipo y el conteo A/B/C.

---

## 1. Matriz de pesos (MATRIZ_PESOS)

Cada pregunta `p1`–`p10` tiene tres opciones (A, B, C). Cada opción tiene 5 pesos (delta, theta, alpha, beta, gamma) que representan la contribución de esa respuesta a cada banda de ondas cerebrales.

- **Delta:** sueño profundo, recuperación.
- **Theta:** calma, procesamiento emocional.
- **Alpha:** calma alerta, transición.
- **Beta:** enfoque, actividad.
- **Gamma:** alto rendimiento, concentración.

Estructura: `MATRIZ_PESOS[pregunta][opcion]` → `{ delta, theta, alpha, beta, gamma }`.

Ejemplo (p1):

| Opción | delta | theta | alpha | beta | gamma |
|--------|-------|-------|-------|------|-------|
| A      | 20    | 5     | 3     | 1    | 0     |
| B      | 3     | 20    | 5     | 2    | 1     |
| C      | 2     | 3     | 12    | 15   | 5     |

La matriz completa está en `lib/quiz-logic.ts` (export `MATRIZ_PESOS`). No modificar valores sin documentar el cambio y re-ejecutar la verificación.

---

## 2. Perfil de ondas (calcularPerfilOndas)

**Entrada:** `answers: Record<string, string>` (claves p1–p10, valores "A" | "B" | "C").

**Salida:** `WaveProfile` con `delta`, `theta`, `alpha`, `beta`, `gamma` en porcentaje (0–100, suma 100).

**Algoritmo:**

1. Para cada pregunta en `answers`, tomar el peso de `MATRIZ_PESOS[pregunta][opcion]` y sumar por onda.
2. Calcular porcentaje de cada onda sobre el total (redondeado).
3. Si la suma de porcentajes no es 100, añadir la diferencia a la onda con mayor porcentaje.

Si no hay respuestas válidas, se devuelve perfil neutro (20, 20, 20, 20, 20).

---

## 3. Identificación del arquetipo (identificarArquetipo)

**Entrada:** `porcentajes: WaveProfile` (delta, theta, alpha, beta, gamma).

**Salida:** `ArchetypeId`: `exhausto` | `insomne` | `ansioso` | `protector` | `disperso` | `performer` | `quemado` | `armonia`.

Las reglas se evalúan **en este orden**. La primera que cumpla define el arquetipo.

| Arquetipo  | Condiciones |
|------------|-------------|
| insomne    | delta ≥ 55, theta ≥ 25, beta === 0 |
| exhausto   | 35 ≤ delta ≤ 50, theta ≥ 20, 5 ≤ beta ≤ 15 |
| protector  | theta ≥ 50, delta ≤ 20, beta ≤ 10 |
| ansioso    | 35 ≤ theta ≤ 45, 10 ≤ beta ≤ 15 |
| performer  | beta ≥ 30, alpha ≥ 30, gamma ≥ 8 |
| disperso   | alpha ≥ 25, beta ≥ 25, 15 ≤ theta ≤ 25 |
| quemado    | delta ≥ 30, theta ≥ 25, alpha ≥ 15, beta ≥ 8 |
| armonia    | delta ≥ 35, theta ≥ 35, beta ≤ 5 |

Si ninguna se cumple, se usa la **onda dominante** (la de mayor porcentaje):

- delta → insomne  
- theta → protector  
- beta → performer  
- alpha (o gamma) → disperso  

---

## 4. Indicadores dinámicos (calcularIndicadoresDinamicos)

**Entrada:** `answers: Record<string, string>`, `archetypeId: ArchetypeId`.

**Salida:** `ArchetypeIndicators`: objeto con 3 indicadores por arquetipo, cada uno con `value` (0–100), `status`, `trend`.

Se cuenta cuántas respuestas A, B y C hay. Con ese conteo y el arquetipo se aplican fórmulas fijas por arquetipo (ej. exhausto: resiliencia, recuperación, disciplina; insomne: alerta, sueñoProfundo, cargaMental; etc.). Las fórmulas están en `lib/quiz-logic.ts` en `calcularIndicadoresDinamicos`.

---

## 5. Mapeo arquetipo → audio sugerido

Los 8 arquetipos se mapean a 3 protocolos de audio (Delta, Theta, Alpha/Gamma):

- **A (Delta):** insomne, exhausto, quemado  
- **B (Theta):** ansioso, protector, armonia  
- **C (Alpha/Gamma):** disperso, performer  

Función: `getAudioKeyByArchetype(archetype: ArchetypeId): 'A' | 'B' | 'C'`.  
El frontend usa `getAudioByArchetype(getAudioKeyByArchetype(archetype))` de `lib/constants.ts` para el preview.

---

## 6. Datos de los 8 arquetipos (ARCHETYPES_FULL)

Cada arquetipo tiene en `ARCHETYPES_FULL`: título, descripción, onda(s), aura (color), subtitle, status, tagline, binauralRecommendation, radarStats, protocol, quest, warning, fortalezas, pasando, pasandoNote, tip. Se usa en la vista de resultados del quiz (`components/features/QuizResults.tsx`).

---

## 7. Uso en el backend

En `app/actions/quiz.ts`, al enviar el quiz:

1. Se valida email y que existan las 10 respuestas (p1–p10).
2. `calcularPerfilOndas(answers)` → perfil.
3. `identificarArquetipo(perfil)` → arquetipo.
4. `calcularIndicadoresDinamicos(answers, arquetipo)` → indicadores.
5. Se persiste en `QuizSubmission` (email, answers, archetype) y se devuelve `{ archetype, indicadores }` al cliente.

---

## 8. Verificación

Para comprobar que la matriz y las reglas no se han alterado:

```bash
npx ts-node --compiler-options '{"module":"NodeNext","moduleResolution":"NodeNext"}' scripts/verify-quiz-weights.ts
```

El script comprueba una muestra de la matriz y ejecuta cuatro casos (todas A, todas B, todas C, mixto) e imprime perfil y arquetipo resultante.
