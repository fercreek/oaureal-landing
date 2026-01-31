'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Target, AlertTriangle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import AudioPreview from '@/components/features/AudioPreview';
import { getAudioByArchetype } from '@/lib/constants';
import { ARCHETYPES_FULL, getAudioKeyByArchetype, type ArchetypeId, type ArchetypeIndicators } from '@/lib/quiz-logic';

function createRadarPath(data: { value: number }[]) {
  const center = 100;
  const maxRadius = 80;
  const angleStep = (2 * Math.PI) / data.length;
  const points = data.map((item, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const radius = (item.value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  });
  return points.join(' ');
}

function createRadarGrid() {
  const center = 100;
  const levels = [20, 40, 60, 80];
  const angleStep = (2 * Math.PI) / 5;
  return levels.map((radius) => {
    const points = Array.from({ length: 5 }, (_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  });
}

const INDICATOR_LABELS: Record<string, string> = {
  resiliencia: 'Resiliencia',
  recuperacion: 'Recuperación',
  disciplina: 'Disciplina',
  alerta: 'Alerta',
  sueñoProfundo: 'Sueño profundo',
  cargaMental: 'Carga mental',
  actividadMental: 'Actividad mental',
  productividad: 'Productividad',
  pazInterna: 'Paz interna',
  control: 'Control',
  conexion: 'Conexión',
  resistencia: 'Resistencia',
  creatividad: 'Creatividad',
  ejecucion: 'Ejecución',
  foco: 'Foco',
  rendimiento: 'Rendimiento',
  riesgoDesgaste: 'Riesgo desgaste',
  energiaVital: 'Energía vital',
  umbralEstres: 'Umbral estrés',
  capacidadEmpuje: 'Capacidad empuje',
  saturacionExterna: 'Saturación externa',
  presencia: 'Presencia',
  armonia: 'Armonía',
};

export default function QuizResultsView({
  archetype,
  indicadores,
}: {
  archetype: ArchetypeId;
  indicadores: ArchetypeIndicators | null;
}) {
  const data = ARCHETYPES_FULL[archetype];
  const suggestedAudio = getAudioByArchetype(getAudioKeyByArchetype(archetype));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <div
          className="inline-block p-10 rounded-full mb-6 relative"
          style={{ backgroundColor: data.aura, boxShadow: `0 0 60px ${data.aura}` }}
        >
          <Brain size={80} color="white" />
        </div>
        <p className="text-primary tracking-[0.3em] font-subtitle font-bold text-sm mb-2">RESULTADO OBTENIDO</p>
        <h2 className="text-4xl md:text-5xl font-title mb-2 italic text-text">{data.title}</h2>
        {data.subtitle && (
          <p className="text-text-muted text-lg font-body mb-2">{data.subtitle}</p>
        )}
        <p className="text-text-muted max-w-lg mx-auto text-lg font-body italic">&quot;{data.status}&quot;</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Tu Recomendación Binaural</h3>
          </div>
          <h4 className="font-title text-text mb-3">{data.binauralRecommendation.title}</h4>
          <p className="text-text-muted font-body text-sm leading-relaxed mb-4">
            {data.binauralRecommendation.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {data.binauralRecommendation.waves.map((wave) => (
              <span
                key={wave}
                className="px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-subtitle font-bold"
              >
                Ondas {wave}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Mapa de Estado</h3>
          </div>
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[240px] mx-auto">
              {createRadarGrid().map((points, i) => (
                <polygon
                  key={i}
                  points={points}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeOpacity={0.1 + i * 0.05}
                  strokeWidth="1"
                />
              ))}
              {data.radarStats.map((_, i) => {
                const angleStep = (2 * Math.PI) / data.radarStats.length;
                const angle = angleStep * i - Math.PI / 2;
                const x = 100 + 80 * Math.cos(angle);
                const y = 100 + 80 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={x}
                    y2={y}
                    stroke="var(--color-primary)"
                    strokeOpacity="0.2"
                    strokeWidth="1"
                  />
                );
              })}
              <polygon
                points={createRadarPath(data.radarStats)}
                fill="var(--color-primary)"
                fillOpacity="0.2"
                stroke="var(--color-primary)"
                strokeWidth="2"
              />
              {data.radarStats.map((item, i) => {
                const angleStep = (2 * Math.PI) / data.radarStats.length;
                const angle = angleStep * i - Math.PI / 2;
                const x = 100 + 95 * Math.cos(angle);
                const y = 100 + 95 * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill="var(--color-text-muted)"
                    fontSize="10"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-body"
                  >
                    {item.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {indicadores && Object.keys(indicadores).length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Indicadores Clave</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(indicadores).map(([key, stat]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-muted font-body capitalize">
                    {INDICATOR_LABELS[key] ?? key}
                  </span>
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-primary" />}
                  {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-primary" />}
                  <span className="font-subtitle font-bold text-primary">{stat.value}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Tu Protocolo Personalizado</h3>
          </div>
          <div className="space-y-4">
            {data.protocol.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-subtitle text-primary mb-1">Prioridad {item.priority}</p>
                  <h4 className="font-title text-text text-sm mb-1">{item.goal}</h4>
                  <p className="text-text-muted font-body text-xs leading-relaxed">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Tu Reto Diario</h3>
          </div>
          <h4 className="font-title text-text mb-4">{data.quest.title}</h4>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-subtitle text-primary mb-1">Tu misión</p>
              <p className="text-sm text-text font-body">{data.quest.mission}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-subtitle text-primary mb-1">Lo que ganas</p>
              <p className="text-sm text-text font-body">{data.quest.reward}</p>
            </div>
            <div className="p-3 rounded-xl border border-primary/20">
              <p className="text-xs text-text-muted font-body italic">{data.quest.note}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-primary/30 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <h3 className="font-title text-lg text-text">Sistema de Alerta</h3>
        </div>
        <p className="text-text-muted font-body text-sm leading-relaxed">{data.warning}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Tus Fortalezas</h3>
          </div>
          <p className="text-text-muted font-body text-sm leading-relaxed">{data.fortalezas}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Diagnóstico</h3>
          </div>
          <p className="text-text-muted font-body text-sm leading-relaxed mb-4">{data.pasando}</p>
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-text-muted font-body italic">{data.pasandoNote}</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-title text-lg text-text">Acción Inmediata</h3>
        </div>
        <p className="text-text-muted font-body text-sm leading-relaxed">{data.tip}</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
        <h3 className="font-title text-lg text-text mb-4">Tu protocolo binaural personalizado Oaureal</h3>
        <p className="text-text-muted font-body text-sm leading-relaxed mb-4">
          Diseñado según la combinación específica de ondas que tu sistema necesita priorizar ahora.
        </p>
        <h4 className="font-subtitle text-primary text-sm mb-3">¿Qué incluye?</h4>
        <ul className="space-y-3 text-sm font-body text-text-muted">
          <li className="flex gap-3">
            <span className="text-primary">✔</span>
            <span>Pack de audios binaurales personalizados. Frecuencias ajustadas a tu perfil.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✔</span>
            <span>Audios en formato WAV (alta fidelidad). Sin compresión. Señal limpia y precisa.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✔</span>
            <span>Guía de uso en PDF. Rutinas sugeridas, técnicas de respiración y prácticas de regulación.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✔</span>
            <span>Plantilla de seguimiento imprimible. Registro de hábitos y emociones.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✔</span>
            <span>Qué puedes esperar con el uso constante. Mayor calma, enfoque y descanso profundo.</span>
          </li>
        </ul>
      </div>

      <div className="text-center mb-10">
        <p className="text-primary tracking-[0.3em] font-subtitle font-bold text-sm mb-2">AUDIO SUGERIDO</p>
        <h3 className="text-2xl font-title text-text mb-4">Basado en tu diagnóstico</h3>
        <p className="text-text-muted text-sm max-w-xl mx-auto font-body mb-6">
          Hemos seleccionado un protocolo de audio específico para tu estado actual. Prueba el preview a continuación.
        </p>
        <AudioPreview
          name={suggestedAudio.name}
          frequency={suggestedAudio.frequency}
          duration={suggestedAudio.duration}
          description={suggestedAudio.description}
          color={suggestedAudio.color}
          binauralFreq={suggestedAudio.binauralFreq}
        />
      </div>

      <div className="text-center">
        <p className="text-text-muted font-body text-sm mb-2">Inversión</p>
        <p className="text-3xl font-title text-text mb-2">$555 MXN</p>
        <p className="text-text-secondary text-sm font-body mb-6">Pago único · Sin suscripciones · Acceso inmediato</p>
        <button className="px-10 py-4 bg-primary text-bg font-subtitle font-bold rounded-xl shadow-[0_0_20px_var(--color-primary)] hover:opacity-90 transition-all">
          CONSEGUIR MI PLAN COMPLETO
        </button>
        <p className="text-xs text-text-secondary mt-4 font-body">
          Accede a todos los protocolos de audio y personaliza tu entrenamiento
        </p>
      </div>
    </motion.div>
  );
}
