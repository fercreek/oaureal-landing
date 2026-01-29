export const COLORS = {
  bg: '#000000',
  primary: '#78e8f8', // Turquesa claro
  secondary: '#54008c', // Púrpura oscuro
  tertiary: '#520f5e', // Púrpura medio
  deepBlue: '#011797', // Azul intenso
  accent: '#78e8f8',
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
  { 
    q: "¿Cuál es tu prioridad número uno hoy?", 
    a: "Lograr un descanso profundo y despertar con energía.", 
    b: "Calmar la mente, los miedos y la rumiación constante.", 
    c: "Terminar mis pendientes sin distraerme tanto." 
  },
  { 
    q: "¿Cómo te sientes físicamente los primeros 30 minutos al despertar?", 
    a: "Agotado, como si no hubiera dormido.", 
    b: "Ansioso o con el pecho apretado por lo que viene en el día.", 
    c: "Bien, pero me cuesta arrancar con la tarea más importante." 
  },
  { 
    q: "¿Qué sucede cuando intentas concentrarte en una sola tarea?", 
    a: "Me quedo dormido o me falta energía física.", 
    b: "Mi mente salta a preocupaciones o problemas personales.", 
    c: "Me distraigo con el celular o salto de un proyecto a otro." 
  },
  { 
    q: "En situaciones de conflicto o estrés, ¿cuál es tu tendencia?", 
    a: "Me siento demasiado cansado para lidiar con ello.", 
    b: "Me preocupo en exceso por lo que otros piensen o por perder el control.", 
    c: "Me frustro porque el conflicto me quita tiempo para ser productivo." 
  },
  { 
    q: "¿Cómo es tu diálogo interno la mayor parte del tiempo?", 
    a: '"Necesito un descanso, no puedo más".', 
    b: '"Algo malo puede pasar" o "¿Por qué dije eso?".', 
    c: '"Tengo mucho que hacer y no sé por dónde empezar".' 
  },
  { 
    q: "¿Qué hábito te domina cuando estás bajo presión?", 
    a: "Trasnochar viendo pantallas para 'desconectarme'.", 
    b: "Comer por ansiedad o buscar validación externa.", 
    c: "Procrastinar y dejar las cosas para el último momento." 
  },
  { 
    q: "¿A qué hora sientes que tu sistema nervioso está más alterado?", 
    a: "En la madrugada (despierto y no puedo volver a dormir).", 
    b: "Todo el día, es una tensión constante.", 
    c: "En las tardes, cuando veo que el tiempo no me alcanzó." 
  },
  { 
    q: "Si pudieras eliminar un 'miedo', ¿cuál sería?", 
    a: "Miedo a que mi salud colapse por falta de descanso.", 
    b: "Miedo a ser rechazado, juzgado o no ser suficiente.", 
    c: "Miedo a fracasar o a ser visto como alguien mediocre/incapaz." 
  },
  { 
    q: "¿Qué te impide apagar la mente por la noche?", 
    a: "Mi cuerpo está acelerado aunque mi mente esté agotada.", 
    b: "Repaso conversaciones del día o miedos sobre el futuro.", 
    c: "Planeo todo lo que 'tengo' que hacer mañana." 
  },
  { 
    q: "¿Qué resultado te haría sentir que este proceso valió la pena?", 
    a: "Dormir 7-8 horas seguidas y despertar ligero.", 
    b: "Sentir paz mental y seguridad emocional ante los problemas.", 
    c: "Estar en estado de 'flujo' y ser altamente efectivo." 
  }
];

export const QUIZ_MOTIVATION_CARDS = [
  {
    afterQuestion: 1,
    title: "No hay respuestas correctas o incorrectas.",
    text: "Este test no te evalúa: traduce señales de tu sistema nervioso."
  },
  {
    afterQuestion: 2,
    title: "¿Qué son los binaurales?",
    text: "Son estímulos sonoros que ayudan a tu cerebro a recordar estados como descanso, calma o enfoque. No fuerzan nada: le dan una referencia para autorregularse."
  },
  {
    afterQuestion: 4,
    title: "Señal de alta fidelidad",
    text: "Para que el cerebro se sincronice, la señal debe ser estable. Las plataformas digitales comprimen el audio y alteran esa precisión. Por eso nuestros protocolos se descargan directamente en tu celular, en formato de alta fidelidad y sin compresión."
  },
  {
    afterQuestion: 5,
    title: "Entrenamiento personalizado",
    text: "Cada persona necesita entrenar estados distintos. No todos los sistemas nerviosos se desregulan igual. Por eso no trabajamos con audios genéricos, sino con combinaciones personalizadas."
  },
  {
    afterQuestion: 7,
    title: "Ya casi terminamos.",
    text: "Estás a punto de ver lo que tu propio sistema te viene pidiendo desde hace tiempo…"
  },
  {
    afterQuestion: 8,
    title: "Cambios que suelen aparecer con el entrenamiento:",
    text: "Más silencio interno. Más descanso real. Más claridad para el día a día."
  }
];

export const FAQ_ITEMS = [
  {
    q: "¿Esto cura o trata alguna condición médica?",
    a: "No. Las frecuencias Oaureal no son un tratamiento médico ni terapéutico. Están diseñadas como un apoyo para favorecer estados de calma, enfoque o descanso. Si estás en un proceso médico o terapéutico, pueden acompañarlo, pero no lo sustituyen.",
  },
  {
    q: "¿En cuánto tiempo notaré resultados?",
    a: "Cada mente responde de forma distinta. Algunas personas perciben cambios desde las primeras escuchas, mientras que en otras el efecto es más gradual. Oaureal funciona como entrenamiento: la constancia, el volumen bajo y un entorno tranquilo son clave.",
  },
  {
    q: "No sentí nada al escucharlos, ¿funcionan?",
    a: "Sí, es completamente normal. No todas las personas experimentan sensaciones inmediatas. En muchos casos, los cambios se manifiestan de forma sutil en el día a día, más que durante la escucha. El uso constante y consciente es lo que permite que el efecto se consolide.",
  },
  {
    q: "¿Pueden hacerme daño?",
    a: "No deberían causar molestias si se usan correctamente: con audífonos y volumen bajo. Si en algún momento sientes incomodidad, basta con pausar y descansar. Todos los audios están diseñados para ser suaves y seguros.",
  },
  {
    q: "¿Esto sustituye terapia o medicación?",
    a: "No. Oaureal no reemplaza terapia psicológica, psiquiátrica ni tratamientos médicos. Es una herramienta complementaria de bienestar y regulación del sistema nervioso.",
  },
  {
    q: "¿Puedo usarlos si tengo ansiedad, estrés o problemas de sueño?",
    a: "Muchas personas los utilizan como apoyo para calmar la mente, reducir el estrés o mejorar el descanso. No sustituyen un tratamiento médico, son una herramienta de acompañamiento.",
  },
  {
    q: "¿Esto estabiliza el sistema nervioso?",
    a: "No de forma inmediata ni clínica. Oaureal ofrece condiciones favorables para que el sistema nervioso aprenda a salir de la sobrecarga mediante repetición y uso consciente.",
  },
  {
    q: "¿Cuánto tiempo debo escucharlos?",
    a: "Puedes utilizarlos todos los días. Se recomienda un mínimo de 10 a 20 minutos por sesión, con audífonos y volumen bajo. Las frecuencias de sueño se usan por la noche; las de enfoque, durante el día.",
  },
  {
    q: "¿Cómo funcionan las frecuencias Oaureal?",
    a: "Utilizan patrones sonoros diseñados para ayudar a la mente a entrar en estados de calma, descanso o enfoque. No es magia ni medicina. Es un entrenamiento suave y no invasivo para el sistema nervioso.",
  },
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
    color: '#78e8f8',
    binauralFreq: 10
  }
] as const;

export function getAudioByArchetype(archetype: keyof typeof ARCHETYPES) {
  return AUDIO_PROTOCOLS.find(audio => audio.archetype === archetype) || AUDIO_PROTOCOLS[0];
}
