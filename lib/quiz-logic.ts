/**
 * Lógica del quiz: pesos por onda, perfil, arquetipo e indicadores dinámicos.
 * Documentación: docs/quiz-logic.md
 * Verificación: scripts/verify-quiz-weights.ts
 */

type WaveWeights = { delta: number; theta: number; alpha: number; beta: number; gamma: number };

export const MATRIZ_PESOS: Record<string, Record<string, WaveWeights>> = {
  p1: {
    A: { delta: 20, theta: 5, alpha: 3, beta: 1, gamma: 0 },
    B: { delta: 3, theta: 20, alpha: 5, beta: 2, gamma: 1 },
    C: { delta: 2, theta: 3, alpha: 12, beta: 15, gamma: 5 },
  },
  p2: {
    A: { delta: 25, theta: 3, alpha: 2, beta: 0, gamma: 0 },
    B: { delta: 5, theta: 18, alpha: 8, beta: 3, gamma: 1 },
    C: { delta: 8, theta: 5, alpha: 10, beta: 12, gamma: 3 },
  },
  p3: {
    A: { delta: 20, theta: 5, alpha: 3, beta: 1, gamma: 0 },
    B: { delta: 3, theta: 20, alpha: 6, beta: 2, gamma: 1 },
    C: { delta: 2, theta: 4, alpha: 15, beta: 18, gamma: 8 },
  },
  p4: {
    A: { delta: 18, theta: 8, alpha: 3, beta: 1, gamma: 0 },
    B: { delta: 4, theta: 22, alpha: 7, beta: 2, gamma: 1 },
    C: { delta: 3, theta: 6, alpha: 12, beta: 16, gamma: 5 },
  },
  p5: {
    A: { delta: 22, theta: 6, alpha: 2, beta: 0, gamma: 0 },
    B: { delta: 3, theta: 25, alpha: 5, beta: 2, gamma: 1 },
    C: { delta: 2, theta: 5, alpha: 13, beta: 17, gamma: 6 },
  },
  p6: {
    A: { delta: 23, theta: 8, alpha: 3, beta: 1, gamma: 0 },
    B: { delta: 5, theta: 23, alpha: 6, beta: 2, gamma: 1 },
    C: { delta: 3, theta: 6, alpha: 14, beta: 18, gamma: 7 },
  },
  p7: {
    A: { delta: 25, theta: 7, alpha: 2, beta: 1, gamma: 0 },
    B: { delta: 5, theta: 22, alpha: 8, beta: 3, gamma: 1 },
    C: { delta: 4, theta: 6, alpha: 13, beta: 15, gamma: 5 },
  },
  p8: {
    A: { delta: 20, theta: 10, alpha: 3, beta: 1, gamma: 0 },
    B: { delta: 4, theta: 25, alpha: 6, beta: 2, gamma: 1 },
    C: { delta: 2, theta: 5, alpha: 11, beta: 19, gamma: 8 },
  },
  p9: {
    A: { delta: 24, theta: 8, alpha: 2, beta: 1, gamma: 0 },
    B: { delta: 6, theta: 23, alpha: 7, beta: 2, gamma: 1 },
    C: { delta: 5, theta: 7, alpha: 12, beta: 16, gamma: 6 },
  },
  p10: {
    A: { delta: 22, theta: 8, alpha: 3, beta: 1, gamma: 0 },
    B: { delta: 4, theta: 24, alpha: 6, beta: 2, gamma: 1 },
    C: { delta: 2, theta: 4, alpha: 16, beta: 20, gamma: 10 },
  },
};

export type WaveProfile = { delta: number; theta: number; alpha: number; beta: number; gamma: number };

export function calcularPerfilOndas(answers: Record<string, string>): WaveProfile {
  const totales: WaveProfile = { delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0 };
  for (const pregunta of Object.keys(answers)) {
    const opcion = answers[pregunta];
    const pesos = MATRIZ_PESOS[pregunta]?.[opcion];
    if (!pesos) continue;
    totales.delta += pesos.delta;
    totales.theta += pesos.theta;
    totales.alpha += pesos.alpha;
    totales.beta += pesos.beta;
    totales.gamma += pesos.gamma;
  }
  const sumaTotal =
    totales.delta + totales.theta + totales.alpha + totales.beta + totales.gamma;
  if (sumaTotal === 0) {
    return { delta: 20, theta: 20, alpha: 20, beta: 20, gamma: 20 };
  }
  const porcentajes: WaveProfile = {
    delta: Math.round((totales.delta / sumaTotal) * 100),
    theta: Math.round((totales.theta / sumaTotal) * 100),
    alpha: Math.round((totales.alpha / sumaTotal) * 100),
    beta: Math.round((totales.beta / sumaTotal) * 100),
    gamma: Math.round((totales.gamma / sumaTotal) * 100),
  };
  const sumaPorc = Object.values(porcentajes).reduce((a, b) => a + b, 0);
  if (sumaPorc !== 100) {
    const diff = 100 - sumaPorc;
    const ondaMax = (Object.entries(porcentajes) as [keyof WaveProfile, number][]).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    porcentajes[ondaMax] += diff;
  }
  return porcentajes;
}

export type ArchetypeId =
  | 'exhausto'
  | 'insomne'
  | 'ansioso'
  | 'protector'
  | 'disperso'
  | 'performer'
  | 'quemado'
  | 'armonia';

export function identificarArquetipo(porcentajes: WaveProfile): ArchetypeId {
  const { delta, theta, alpha, beta, gamma } = porcentajes;
  if (delta >= 55 && theta >= 25 && beta === 0) return 'insomne';
  if (delta >= 35 && delta <= 50 && theta >= 20 && beta >= 5 && beta <= 15) return 'exhausto';
  if (theta >= 50 && delta <= 20 && beta <= 10) return 'protector';
  if (theta >= 35 && theta <= 45 && beta >= 10 && beta <= 15) return 'ansioso';
  if (beta >= 30 && alpha >= 30 && gamma >= 8) return 'performer';
  if (alpha >= 25 && beta >= 25 && theta >= 15 && theta <= 25) return 'disperso';
  if (delta >= 30 && theta >= 25 && alpha >= 15 && beta >= 8) return 'quemado';
  if (delta >= 35 && theta >= 35 && beta <= 5) return 'armonia';
  const ondaDominante = (Object.entries(porcentajes) as [keyof WaveProfile, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  if (ondaDominante === 'delta') return 'insomne';
  if (ondaDominante === 'theta') return 'protector';
  if (ondaDominante === 'beta') return 'performer';
  return 'disperso';
}

export function calcularIndicadoresDinamicos(
  answers: Record<string, string>,
  archetypeId: ArchetypeId
): ArchetypeIndicators {
  const conteo = { A: 0, B: 0, C: 0 };
  Object.values(answers).forEach((resp) => {
    if (resp === 'A' || resp === 'B' || resp === 'C') conteo[resp]++;
  });
  const indicadoresPorArquetipo: Record<ArchetypeId, ArchetypeIndicators> = {
    exhausto: {
      resiliencia: { value: Math.min(100, 70 + conteo.A * 3 + conteo.C * 2), status: 'crítico', trend: 'down' },
      recuperacion: { value: Math.max(5, 30 - conteo.A * 2), status: 'bajo', trend: 'down' },
      disciplina: { value: Math.min(100, 75 + conteo.C * 2), status: 'alto', trend: 'stable' },
    },
    insomne: {
      alerta: { value: Math.min(100, 80 + conteo.A * 2), status: 'crítico', trend: 'up' },
      sueñoProfundo: { value: Math.max(0, 15 - conteo.A * 1.5), status: 'crítico', trend: 'down' },
      cargaMental: { value: Math.min(100, 55 + conteo.B * 2 + conteo.A * 1), status: 'alto', trend: 'up' },
    },
    ansioso: {
      actividadMental: { value: Math.min(100, 80 + conteo.B * 2 + conteo.C * 1), status: 'crítico', trend: 'up' },
      productividad: { value: Math.min(100, 60 + conteo.C * 2), status: 'alto', trend: 'stable' },
      pazInterna: { value: Math.max(5, 35 - conteo.B * 2), status: 'bajo', trend: 'down' },
    },
    protector: {
      control: { value: Math.min(100, 80 + conteo.B * 2), status: 'crítico', trend: 'up' },
      conexion: { value: Math.max(5, 30 - conteo.B * 2), status: 'bajo', trend: 'down' },
      resistencia: { value: Math.min(100, 65 + conteo.A * 1 + conteo.B * 1), status: 'alto', trend: 'stable' },
    },
    disperso: {
      creatividad: { value: Math.min(100, 75 + conteo.C * 1.5), status: 'alto', trend: 'stable' },
      ejecucion: { value: Math.max(10, 40 - conteo.C * 2), status: 'bajo', trend: 'down' },
      foco: { value: Math.max(10, 45 - conteo.C * 1.5), status: 'bajo', trend: 'down' },
    },
    performer: {
      rendimiento: { value: Math.min(100, 80 + conteo.C * 2), status: 'alto', trend: 'stable' },
      resistencia: { value: Math.min(100, 55 + conteo.C * 1.5), status: 'alto', trend: 'down' },
      riesgoDesgaste: { value: Math.min(100, 70 + conteo.C * 1.5 + conteo.A * 1), status: 'crítico', trend: 'up' },
    },
    quemado: {
      energiaVital: { value: Math.max(0, 20 - conteo.A * 1.5 - conteo.B * 1), status: 'crítico', trend: 'down' },
      umbralEstres: { value: Math.min(100, 85 + conteo.A * 1.5 + conteo.B * 1), status: 'crítico', trend: 'up' },
      capacidadEmpuje: { value: Math.max(0, 15 - conteo.A * 1.5), status: 'crítico', trend: 'down' },
    },
    armonia: {
      saturacionExterna: { value: Math.min(100, 70 + conteo.B * 1.5 + conteo.A * 1), status: 'alto', trend: 'up' },
      presencia: { value: Math.max(20, 50 - conteo.B * 1), status: 'bajo', trend: 'stable' },
      armonia: { value: Math.max(15, 45 - conteo.A * 1 - conteo.B * 1), status: 'bajo', trend: 'down' },
    },
  };
  return indicadoresPorArquetipo[archetypeId] ?? indicadoresPorArquetipo.exhausto;
}

export type ArchetypeDisplay = {
  title: string;
  description: string;
  wave: string;
  aura: string;
};

export type ArchetypeIndicator = { value: number; status: string; trend: string };
export type ArchetypeIndicators = Record<string, ArchetypeIndicator>;

export type ArchetypeFull = ArchetypeDisplay & {
  subtitle: string;
  status: string;
  tagline: string;
  binauralRecommendation: { title: string; description: string; waves: string[] };
  radarStats: { label: string; value: number }[];
  protocol: { icon: string; goal: string; action: string; priority: number }[];
  quest: { title: string; mission: string; reward: string; note: string };
  warning: string;
  fortalezas: string;
  pasando: string;
  pasandoNote: string;
  tip: string;
};

export const ARCHETYPES_8: Record<ArchetypeId, ArchetypeDisplay> = {
  exhausto: {
    title: 'El que no ha podido parar',
    description: 'Funcionas... pero a un costo muy alto. Primero recuperar, luego rendir.',
    wave: 'Alfa / Theta',
    aura: 'rgba(84, 0, 140, 0.4)',
  },
  insomne: {
    title: 'El que no logra descansar',
    description: 'Tu cuerpo olvidó cómo descansar. La meta no es dormir más, es volver a saber cómo descansar.',
    wave: 'Delta',
    aura: 'rgba(84, 0, 140, 0.4)',
  },
  ansioso: {
    title: 'La mente inquieta',
    description: 'Haces mucho... pero tu mente no descansa. Primero el espacio, luego el pensamiento.',
    wave: 'Alfa',
    aura: 'rgba(1, 23, 151, 0.4)',
  },
  protector: {
    title: 'El protector interno',
    description: 'Has sobrevivido controlándolo todo. Primero integrar, luego avanzar.',
    wave: 'Alfa / Theta',
    aura: 'rgba(1, 23, 151, 0.4)',
  },
  disperso: {
    title: 'La mente abierta',
    description: 'Talento hay. Dirección falta. Primero el orden, luego la expansión.',
    wave: 'Alfa',
    aura: 'rgba(165, 240, 250, 0.3)',
  },
  performer: {
    title: 'El de alto ritmo',
    description: 'Tu cerebro es una Ferrari. Si no programas tu descanso, tu cuerpo programará tu enfermedad.',
    wave: 'Beta / Alfa',
    aura: 'rgba(165, 240, 250, 0.3)',
  },
  quemado: {
    title: 'El sistema sobrecargado',
    description: 'No estás roto. Estás saturado. No necesitas hacer más. Necesitas ser menos para los demás y más para ti.',
    wave: 'Alfa / Theta / Delta',
    aura: 'rgba(84, 0, 140, 0.4)',
  },
  armonia: {
    title: 'El Buscador de Armonía',
    description: 'Tu meta no es producir, es estar en paz. Primero la paz, luego el mundo.',
    wave: 'Alfa / Theta',
    aura: 'rgba(1, 23, 151, 0.4)',
  },
};

export const ARCHETYPES_FULL: Record<ArchetypeId, ArchetypeFull> = {
  exhausto: {
    title: 'El que no ha podido parar',
    description: 'Funcionas... pero a un costo muy alto. Primero recuperar, luego rendir.',
    wave: 'Alfa / Theta',
    aura: 'rgba(84, 0, 140, 0.4)',
    subtitle: 'El Exhausto Funcional',
    status: 'Funcionas... pero a un costo muy alto',
    tagline: 'Primero recuperar, luego rendir.',
    binauralRecommendation: {
      title: 'Tu sistema necesita transitar del ritmo constante a estados de pausa.',
      description: 'Te podría ayudar escuchar audios que favorecen ondas alfa–theta, para facilitar una desaceleración progresiva y soltar la hiperactividad mental.',
      waves: ['Alfa', 'Theta'],
    },
    radarStats: [
      { label: 'Descanso', value: 15 },
      { label: 'Claridad', value: 45 },
      { label: 'Energía', value: 20 },
      { label: 'Calma', value: 30 },
      { label: 'Enfoque', value: 75 },
    ],
    protocol: [
      { icon: '🌙', goal: 'Descanso Profundo', action: 'Ayudar a tu cuerpo a recuperarse de verdad', priority: 1 },
      { icon: '🧘', goal: 'Soltar la Carga Mental', action: 'Liberar el ruido acumulado durante meses', priority: 2 },
      { icon: '🌊', goal: 'Claridad Durante el Día', action: 'Mantener presencia sin agotarte', priority: 3 },
    ],
    quest: {
      title: 'El Ritmo Sobre El Logro',
      mission: 'Fijar hora de acostarse (No Negociable)',
      reward: 'Restauración del sistema nervioso central',
      note: "El descanso empieza por el ritmo, no por 'lograr dormir rápido'",
    },
    warning: "No es falta de capacidad. Es un sistema en 'Overclock' por demasiado tiempo.",
    fortalezas: 'Eres responsable, cumplido y resiliente. Aun cansado, sigues apareciendo. Tu capacidad de sostenerlo todo habla de una fuerza enorme.',
    pasando: 'Tu cuerpo está agotado, pero tu mente no se permite parar. Vives rindiendo desde la reserva.',
    pasandoNote: 'No es falta de voluntad: es falta de recuperación real.',
    tip: 'Durante 7 días, fija una hora no negociable para acostarte, aunque no tengas sueño. El descanso empieza por el horario, no por dormirte rápido.',
  },
  insomne: {
    title: 'El que no logra descansar',
    description: 'Tu cuerpo olvidó cómo descansar. La meta no es dormir más, es volver a saber cómo descansar.',
    wave: 'Delta',
    aura: 'rgba(84, 0, 140, 0.4)',
    subtitle: 'El Insomne Puro',
    status: 'Tu cuerpo olvidó cómo descansar',
    tagline: 'La meta no es dormir más, es volver a saber cómo descansar.',
    binauralRecommendation: {
      title: 'A tu sistema le cuesta soltar el estado de alerta al final del día.',
      description: 'Te podría ayudar escuchar audios orientados a ondas delta, especialmente antes de dormir, para acompañar el descenso hacia estados de descanso profundo.',
      waves: ['Delta'],
    },
    radarStats: [
      { label: 'Descanso', value: 5 },
      { label: 'Claridad', value: 25 },
      { label: 'Energía', value: 10 },
      { label: 'Calma', value: 15 },
      { label: 'Enfoque', value: 40 },
    ],
    protocol: [
      { icon: '🌙', goal: 'Reaprender el Descanso Profundo', action: 'Ayudar a tu cuerpo a recordar cómo apagarse', priority: 1 },
      { icon: '🧘', goal: 'Calma Pre-Sueño', action: 'Bajar las revoluciones antes de dormir', priority: 2 },
      { icon: '🌊', goal: 'Relajación Durante el Día', action: 'Evitar que el estrés se acumule', priority: 3 },
    ],
    quest: {
      title: 'El Rey de la Oscuridad',
      mission: '0 Pantallas 90 minutos antes de dormir.',
      reward: 'Una señal clara para que tu cuerpo active su proceso natural de descanso.',
      note: "Cortar la luz azul le dice a tu sistema: 'El día ha terminado'",
    },
    warning: "No es que 'no puedas dormir'. Es que tu cuerpo se quedó bloqueado en modo de batalla.",
    fortalezas: 'Eres sensible a tu bienestar y sabes escuchar cuando algo no está bien. Reconocer que necesitas dormir ya es un acto de autocuidado.',
    pasando: "Tu sistema nervioso se quedó en alerta. No es que 'no puedas dormir', es que tu cuerpo ya no recuerda cómo entrar en descanso profundo.",
    pasandoNote: 'El protocolo binaural actuará como un puente para cruzar de la alerta al descanso.',
    tip: 'Evita pantallas brillantes 90 minutos antes de dormir. No para relajarte, sino para decirle a tu cerebro: ya no hay estímulos.',
  },
  ansioso: {
    title: 'La mente inquieta',
    description: 'Haces mucho... pero tu mente no descansa. Primero el espacio, luego el pensamiento.',
    wave: 'Alfa',
    aura: 'rgba(1, 23, 151, 0.4)',
    subtitle: 'El Ansioso Funcional',
    status: 'Haces mucho... pero tu mente no descansa',
    tagline: 'Primero el espacio, luego el pensamiento.',
    binauralRecommendation: {
      title: 'Tu sistema se mantiene activo incluso cuando intentas concentrarte o relajarte.',
      description: 'Te podría ayudar escuchar audios con énfasis en ondas alfa, que apoyan la calma mental sin perder presencia.',
      waves: ['Alfa'],
    },
    radarStats: [
      { label: 'Descanso', value: 30 },
      { label: 'Claridad', value: 50 },
      { label: 'Energía', value: 60 },
      { label: 'Calma', value: 20 },
      { label: 'Enfoque', value: 70 },
    ],
    protocol: [
      { icon: '🧘', goal: 'Reducir el Ruido Interno', action: 'Bajar el volumen de los pensamientos repetitivos', priority: 1 },
      { icon: '🌊', goal: 'Calma sin Tensión', action: 'Trabajar desde un estado tranquilo, no desde la urgencia', priority: 2 },
      { icon: '🌙', goal: 'Blindaje Nocturno', action: 'Asegurar que la mente no despierte a mitad de la noche', priority: 3 },
    ],
    quest: {
      title: 'El Vaciado de Datos',
      mission: 'Escritura de descarga antes de dormir',
      reward: 'Liberación inmediata de la carga mental',
      note: "Escribe todo lo pendiente sin orden. Ciérrala y di: 'mañana continúo'",
    },
    warning: 'Tu desgaste no es físico, es cognitivo. No te cansa lo que haces, sino lo que tu mente repite sin parar.',
    fortalezas: 'Eres capaz, comprometido y mentalmente activo. Tu mente nunca se rinde.',
    pasando: 'Piensas demasiado. No paras ni cuando el día termina. El desgaste no viene de lo que haces, sino de lo que tu mente repite.',
    pasandoNote: "El entrenamiento binaural es progresivo: estamos enseñando a tu cerebro a desvincular el 'hacer' del 'sufrir'.",
    tip: 'Antes de dormir, escribe en una hoja todo lo que te preocupa, sin orden. Ciérrala y di: mañana continúo. Esto descarga la mente.',
  },
  protector: {
    title: 'El protector interno',
    description: 'Has sobrevivido controlándolo todo. Primero integrar, luego avanzar.',
    wave: 'Alfa / Theta',
    aura: 'rgba(1, 23, 151, 0.4)',
    subtitle: 'El Controlador Emocional',
    status: 'Has sobrevivido controlándolo todo',
    tagline: 'Primero integrar, luego avanzar.',
    binauralRecommendation: {
      title: 'Tu sistema está acostumbrado a mantenerse en control constante.',
      description: 'Te podría ayudar escuchar audios que combinan alfa y theta, creando un entorno sonoro que favorece la sensación de seguridad y permite soltar la vigilancia interna.',
      waves: ['Alfa', 'Theta'],
    },
    radarStats: [
      { label: 'Descanso', value: 25 },
      { label: 'Claridad', value: 40 },
      { label: 'Energía', value: 55 },
      { label: 'Calma', value: 15 },
      { label: 'Enfoque', value: 65 },
    ],
    protocol: [
      { icon: '🧘', goal: 'Integración Emocional', action: 'Permitir que las emociones bloqueadas se procesen sin desestabilizarte', priority: 1 },
      { icon: '🌙', goal: 'Descanso Reparador', action: 'Apagar los protocolos de vigilancia para recuperarte de verdad', priority: 2 },
      { icon: '🌊', goal: 'Presencia sin Control', action: 'Habitar el presente sin necesidad de controlarlo todo', priority: 3 },
    ],
    quest: {
      title: 'El Escaneo de Sensor',
      mission: 'Nombrar el estado interno (3 veces al día)',
      reward: 'Descompresión gradual del blindaje emocional',
      note: "Pregúntate '¿Qué estoy sintiendo?' - No analices, solo ponle nombre",
    },
    warning: 'Tu mente aprendió a protegerte desconectando lo que duele. Fue efectivo, pero el costo energético es insostenible.',
    fortalezas: 'Eres fuerte. Has aprendido a seguir adelante incluso cuando algo dentro dolía. Tu mente te protegió.',
    pasando: 'Has tenido que desconectarte de lo que sientes para funcionar. Eso cansa. No porque estés mal, sino porque cargarlo solo pesa.',
    pasandoNote: 'Este protocolo no te exige; te acompaña a soltar el peso de la armadura.',
    tip: 'Durante el día, detente 3 veces y pregúntate: ¿Qué estoy sintiendo ahora mismo? Sin analizar. Solo nombrar.',
  },
  disperso: {
    title: 'La mente abierta',
    description: 'Talento hay. Dirección falta. Primero el orden, luego la expansión.',
    wave: 'Alfa',
    aura: 'rgba(165, 240, 250, 0.3)',
    subtitle: 'El Disperso Creativo',
    status: 'Talento hay. Dirección falta',
    tagline: 'Primero el orden, luego la expansión.',
    binauralRecommendation: {
      title: 'Tu sistema oscila entre creatividad y dispersión.',
      description: 'Te podría ayudar escuchar audios con predominio alfa, que ayudan a sostener enfoque sin apagar la flexibilidad mental.',
      waves: ['Alfa'],
    },
    radarStats: [
      { label: 'Descanso', value: 35 },
      { label: 'Claridad', value: 45 },
      { label: 'Energía', value: 70 },
      { label: 'Calma', value: 40 },
      { label: 'Enfoque', value: 30 },
    ],
    protocol: [
      { icon: '🌊', goal: 'Estado de Flujo', action: 'Mantener tu mente enfocada en el presente sin saltar a la próxima idea', priority: 1 },
      { icon: '⚡', goal: 'Enfoque Sostenido', action: 'Capacidad de terminar tareas técnicas sin dispersarte', priority: 2 },
      { icon: '🧘', goal: 'Orden Creativo', action: 'Organizar las ideas del día para que no saturen tu mente', priority: 3 },
    ],
    quest: {
      title: 'El Tiro de Precisión',
      mission: 'Seleccionar y terminar UNA sola tarea importante',
      reward: 'Dopamina real por cierre, no por inicio',
      note: 'Terminar una tarea vale más que iniciar diez',
    },
    warning: 'No es falta de capacidad, es exceso de visión. Tu motor gira en neutro: mucha potencia, pero las ruedas no tocan el suelo.',
    fortalezas: 'Eres creativo, intuitivo y lleno de ideas. Ves posibilidades donde otros no.',
    pasando: 'Tu mente va más rápido que tu capacidad de ejecutar. Eso genera frustración y ansiedad.',
    pasandoNote: 'Este protocolo te da la tracción necesaria para que tu talento finalmente avance.',
    tip: 'Elige una sola tarea importante al día. Solo una. Terminar una, vale más que empezar diez.',
  },
  performer: {
    title: 'El de alto ritmo',
    description: 'Tu cerebro es una Ferrari. Si no programas tu descanso, tu cuerpo programará tu enfermedad.',
    wave: 'Beta / Alfa',
    aura: 'rgba(165, 240, 250, 0.3)',
    subtitle: 'El Ultra-Performer',
    status: 'Tu cerebro es una Ferrari. Vamos a optimizar cada cilindro',
    tagline: 'Si no programas tu descanso, tu cuerpo programará tu enfermedad.',
    binauralRecommendation: {
      title: 'Tu sistema está entrenado para el rendimiento continuo.',
      description: 'Te podría ayudar escuchar audios que facilitan la transición de beta a alfa, permitiendo bajar el ritmo sin desconectarte por completo.',
      waves: ['Beta', 'Alfa'],
    },
    radarStats: [
      { label: 'Descanso', value: 40 },
      { label: 'Claridad', value: 85 },
      { label: 'Energía', value: 80 },
      { label: 'Calma', value: 50 },
      { label: 'Enfoque', value: 95 },
    ],
    protocol: [
      { icon: '⚡', goal: 'Enfoque Máximo', action: 'Maximizar los bloques de trabajo profundo sin dispersión', priority: 1 },
      { icon: '🌊', goal: 'Enfriamiento Activo', action: 'Transicionar del alto rendimiento a la calma sin colapso', priority: 2 },
      { icon: '🌙', goal: 'Super-Recuperación', action: 'Reparación profunda para despertar al 100%', priority: 3 },
    ],
    quest: {
      title: 'El Descanso del Guerrero',
      mission: 'Integrar pausas breves de desconexión total durante el día para permitir que tu sistema baje carga sin perder rendimiento.',
      reward: 'Sostener claridad y alto desempeño a largo plazo, evitando el desgaste invisible que aparece después.',
      note: 'Sin música, sin lectura, sin pantallas. Permite una pausa.',
    },
    warning: 'El riesgo para ti no es el fracaso, sino la erosión del sistema que te permite ganar. No eres una máquina infinita.',
    fortalezas: 'Eres disciplinado, ambicioso y mentalmente fuerte. Ya operas en alto nivel.',
    pasando: 'El riesgo no es fallar, es pagar demasiado caro tu rendimiento.',
    pasandoNote: 'Eres un atleta mental de élite. La recuperación estratégica es parte del entrenamiento.',
    tip: 'Agenda pausas como si fueran reuniones importantes. El cerebro rinde más cuando sabe que habrá recuperación.',
  },
  quemado: {
    title: 'El sistema sobrecargado',
    description: 'No estás roto. Estás saturado. No necesitas hacer más. Necesitas ser menos para los demás y más para ti.',
    wave: 'Alfa / Theta / Delta',
    aura: 'rgba(84, 0, 140, 0.4)',
    subtitle: 'El Quemado Total',
    status: 'No estás roto. Estás saturado',
    tagline: 'No necesitas hacer más. Necesitas ser menos para los demás y más para ti.',
    binauralRecommendation: {
      title: 'Tu sistema está acumulando múltiples capas de activación.',
      description: 'Te podría ayudar escuchar secuencias progresivas que atraviesan alfa, theta y delta, acompañando un proceso gradual de descarga y regulación.',
      waves: ['Alfa', 'Theta', 'Delta'],
    },
    radarStats: [
      { label: 'Descanso', value: 5 },
      { label: 'Claridad', value: 15 },
      { label: 'Energía', value: 5 },
      { label: 'Calma', value: 10 },
      { label: 'Enfoque', value: 20 },
    ],
    protocol: [
      { icon: '🌙', goal: 'Reparación Profunda', action: "El único estado donde tu cuerpo puede limpiar el estrés acumulado", priority: 1 },
      { icon: '🧘', goal: "Descompresión Emocional", action: "Procesar el agotamiento sin presión de 'estar bien'", priority: 2 },
      { icon: '🌊', goal: 'Reconexión Contigo', action: 'Volver a habitar el presente sin que todo se sienta como amenaza', priority: 3 },
    ],
    quest: {
      title: 'El Ayuno de Ruido',
      mission: 'Reducción drástica de estímulos (Digital Detox 48h)',
      reward: 'Inicio de la reconstrucción de tu base energética',
      note: 'Si no es esencial para tu supervivencia hoy, no le des tu energía',
    },
    warning: 'Tu sistema ha activado el protocolo de apagado porque ya no puede sostener la carga. No intentes empujar.',
    fortalezas: 'Has dado demasiado durante demasiado tiempo. Eso habla de entrega, no de debilidad.',
    pasando: 'Tu sistema está pidiendo pausa profunda. No más empuje.',
    pasandoNote: 'La única forma de salir es bajando el volumen de todo lo que te rodea.',
    tip: 'Reduce estímulos: menos noticias, menos redes, menos exigencia por unos días.',
  },
  armonia: {
    title: 'El Buscador de Armonía',
    description: 'Tu meta no es producir, es estar en paz. Primero la paz, luego el mundo.',
    wave: 'Alfa / Theta',
    aura: 'rgba(1, 23, 151, 0.4)',
    subtitle: '',
    status: 'Tu meta no es producir, es estar en paz',
    tagline: 'Primero la paz, luego el mundo.',
    binauralRecommendation: {
      title: 'Tu sistema busca equilibrio entre actividad y descanso.',
      description: 'Te podría ayudar escuchar audios con combinaciones suaves de alfa y theta, pensadas para sostener estados de balance y coherencia interna.',
      waves: ['Alfa', 'Theta'],
    },
    radarStats: [
      { label: 'Descanso', value: 50 },
      { label: 'Claridad', value: 55 },
      { label: 'Energía', value: 45 },
      { label: 'Calma', value: 35 },
      { label: 'Enfoque', value: 40 },
    ],
    protocol: [
      { icon: '🧘', goal: 'Silencio Interior', action: 'Disolver la presión de las expectativas externas y volver a tu centro', priority: 1 },
      { icon: '🌊', goal: 'Presencia Consciente', action: 'Habitar el mundo sin sentirte abrumado por sus estímulos', priority: 2 },
      { icon: '🌙', goal: 'Descanso Restaurador', action: 'Un sueño que limpia tanto el cuerpo como el campo emocional', priority: 3 },
    ],
    quest: {
      title: 'El Vacío Sagrado',
      mission: '10 Minutos de No-Hacer',
      reward: 'Recuperación de la soberanía sobre tu propio tiempo',
      note: 'Sin música, sin meditación guiada, sin productividad. Solo estar',
    },
    warning: 'La vida moderna está diseñada para sobreestimularte. Tu sensibilidad no es una debilidad, es tu radar.',
    fortalezas: 'Tienes una sensibilidad especial. Buscas equilibrio, no exceso.',
    pasando: 'La vida moderna te sobreestimula. Necesitas refugio interno.',
    pasandoNote: 'Este protocolo construye un santuario interno tan estable que el ruido ya no puede entrar.',
    tip: 'Dedica 10 minutos diarios a no hacer nada. Sin objetivo. Solo estar.',
  },
};

const ARCHETYPE_TO_AUDIO_KEY: Record<ArchetypeId, 'A' | 'B' | 'C'> = {
  insomne: 'A',
  exhausto: 'A',
  quemado: 'A',
  ansioso: 'B',
  protector: 'B',
  armonia: 'B',
  disperso: 'C',
  performer: 'C',
};

export function getAudioKeyByArchetype(archetype: ArchetypeId): 'A' | 'B' | 'C' {
  return ARCHETYPE_TO_AUDIO_KEY[archetype] ?? 'A';
}
