export const COLORS = {
  bg: '#000000',
  primary: '#011797',
  secondary: '#54008c',
  accent: '#a5f0fa',
  surface: '#121212',
};

export const ARCHETYPES = {
  A: {
    title: "Protocolo de Sueño y Restauración",
    wave: "Delta",
    description: "Tu cuerpo está operando en 'modo reserva'. Necesitamos resetear tu descanso profundo.",
    aura: "rgba(84, 0, 140, 0.4)"
  },
  B: {
    title: "Protocolo de Apoyo Emocional",
    wave: "Theta",
    description: "Tu mente procesa más de lo que tu paz puede permitir. Vamos a calmar el ruido mental.",
    aura: "rgba(1, 23, 151, 0.4)"
  },
  C: {
    title: "Protocolo de Enfoque y Alto Rendimiento",
    wave: "Alpha/Gamma",
    description: "Tienes el motor encendido, pero la dirección está bloqueada. Vamos a centrar tu atención.",
    aura: "rgba(165, 240, 250, 0.3)"
  }
} as const;

export const QUIZ_QUESTIONS = [
  { q: "¿Cuál es tu necesidad emocional más urgente en este momento?", a: "Recuperar energía y descansar profundamente", b: "Calmar mi mente y reducir la ansiedad", c: "Enfocarme y aumentar mi productividad" },
  { q: "¿Cómo describirías tu estado emocional actual?", a: "Agotado, necesito desconectar completamente", b: "Ansioso, mi mente no para de pensar", c: "Disperso, me cuesta concentrarme" },
  { q: "¿Qué te impide sentirte en equilibrio emocional?", a: "Falta de sueño reparador", b: "Preocupaciones constantes y rumiación", c: "Sobrecarga mental y falta de claridad" },
  { q: "¿Cuándo sientes que tu bienestar emocional está más comprometido?", a: "Por las noches, no puedo descansar bien", b: "Todo el día, siento ansiedad constante", c: "Durante el trabajo, me distraigo fácilmente" },
  { q: "¿Qué emoción predomina cuando piensas en tu día a día?", a: "Cansancio y necesidad de pausa", b: "Preocupación y tensión", c: "Frustración por no rendir como quiero" },
  { q: "¿Qué necesitas para sentirte mejor emocionalmente?", a: "Sueño profundo y restauración completa", b: "Calma mental y reducción de ansiedad", c: "Claridad mental y enfoque sostenido" },
  { q: "¿Cómo afecta tu estado emocional a tu vida diaria?", a: "Me siento sin energía para hacer nada", b: "La ansiedad me paraliza en muchas situaciones", c: "No logro completar tareas por falta de concentración" },
  { q: "¿Qué te gustaría lograr con el entrenamiento emocional?", a: "Dormir profundamente y despertar renovado", b: "Encontrar paz mental y reducir el ruido interno", c: "Alcanzar estados de flow y alto rendimiento" },
  { q: "¿Cuál es tu mayor desafío emocional en este momento?", a: "Recuperar mi energía y capacidad de descanso", b: "Manejar la ansiedad y los pensamientos intrusivos", c: "Mantener la concentración y evitar distracciones" },
  { q: "¿Qué resultado emocional sería más valioso para ti ahora?", a: "Sueño reparador de 8 horas consecutivas", b: "Paz mental y reducción significativa de ansiedad", c: "Estado de flow y productividad sostenida" }
];

export const FAQ_ITEMS = [
  { q: "¿Esto cura alguna condición médica?", a: "No. Oaureal es bienestar y entrenamiento mental complementario." },
  { q: "¿En cuánto tiempo notaré resultados?", a: "Alivio inmediato. Cambios reales estructurales en 6 semanas de uso constante." },
  { q: "¿Necesito audífonos?", a: "Sí, los audífonos son esenciales para el efecto binaural (separación de frecuencias)." }
];

export const PRICING_PLANS = [
  { name: "Prueba", time: "1 SEMANA", price: "$149", desc: "Ideal para experimentar el cambio." },
  { name: "Popular", time: "1 MES", price: "$329", desc: "El tiempo mínimo para ver cambios estructurales.", promo: "-60%" },
  { name: "Maestría", time: "3 MESES", price: "$649", desc: "Entrenamiento continuo para el sistema nervioso." }
];

export const INVESTMENT_ITEMS = [
  { 
    title: "Landing & Quiz", 
    price: "$8,000 - $12,000", 
    desc: "Arquitectura SPA, diseño cinematic y lógica de segmentación."
  },
  { 
    title: "Stripe Checkout", 
    price: "$10,000", 
    desc: "Integración de pasarela de pagos, cupones y webhooks seguros."
  },
  { 
    title: "Sistema de Entrega", 
    price: "$5,000", 
    desc: "Automatización de fulfillment (Email + Descarga inmediata)."
  }
];

export const AUDIO_PROTOCOLS = [
  {
    id: 'delta-restoration',
    name: 'Sueño Profundo Delta',
    frequency: 'Delta (0.5-4 Hz)',
    duration: 45,
    description: 'Protocolo diseñado para inducir sueño profundo y restauración completa. Ideal para resetear tu ciclo de descanso.',
    archetype: 'A' as const,
    useCase: 'sueño',
    color: '#54008c',
    binauralFreq: 2.5
  },
  {
    id: 'theta-emotional',
    name: 'Calma Theta',
    frequency: 'Theta (4-8 Hz)',
    duration: 30,
    description: 'Frecuencias Theta para calmar el ruido mental y procesar emociones. Reduce ansiedad y promueve paz interior.',
    archetype: 'B' as const,
    useCase: 'relajación',
    color: '#011797',
    binauralFreq: 6
  },
  {
    id: 'alpha-focus',
    name: 'Enfoque Alpha',
    frequency: 'Alpha (8-13 Hz)',
    duration: 25,
    description: 'Estado de calma alerta perfecto para concentración y alto rendimiento. Sincroniza tu mente para el trabajo profundo.',
    archetype: 'C' as const,
    useCase: 'concentración',
    color: '#a5f0fa',
    binauralFreq: 10
  }
] as const;

export function getAudioByArchetype(archetype: keyof typeof ARCHETYPES) {
  return AUDIO_PROTOCOLS.find(audio => audio.archetype === archetype) || AUDIO_PROTOCOLS[0];
}
