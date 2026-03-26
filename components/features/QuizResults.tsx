'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, AlertTriangle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ARCHETYPES_FULL, type ArchetypeId, type ArchetypeIndicators } from '@/lib/quiz-logic';

function getSocialProofCount(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Seed determinístico por mes para que la secuencia sea consistente
  const seed = year * 100 + month;
  const rng = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };
  // Distribuir 80 unidades (de 20 a 100) en los días del mes con variación aleatoria
  let total = 20;
  for (let d = 1; d < day; d++) {
    const remaining = daysInMonth - d;
    const needed = 100 - total;
    const maxStep = Math.min(needed, Math.ceil(needed / Math.max(remaining, 1)) + 3);
    const step = Math.round(rng(d) * maxStep);
    total = Math.min(100, total + step);
  }
  return total;
}

function SocialProofCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getSocialProofCount());
  }, []);

  if (count === null) return null;

  return (
    <div className="flex justify-center mb-4">
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-subtitle text-sm font-bold"
        style={{
          color: '#78e8f8',
          border: '1px solid rgba(120,232,248,0.35)',
          background: 'rgba(120,232,248,0.06)',
          textShadow: '0 0 10px rgba(120,232,248,0.7)',
          boxShadow: '0 0 14px rgba(120,232,248,0.15)',
          fontFamily: 'monospace',
          letterSpacing: '0.03em',
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: '#78e8f8', fontSize: '8px' }}
        >
          ◉
        </motion.span>
        {count} personas han activado su protocolo este mes.
      </div>
    </div>
  );
}

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

const STRIPE_LINKS: Record<ArchetypeId, string> = {
  exhausto:   'https://buy.stripe.com/6oU7sE1gd7zKgMg5ko43S09',
  insomne:    'https://buy.stripe.com/3cI6oAgb76vG0Ni00443S07',
  ansioso:    'https://buy.stripe.com/4gMeV6gb7g6g7bG28c43S08',
  protector:  'https://buy.stripe.com/6oU7sE1gd7zKgMg5ko43S09',
  disperso:   'https://buy.stripe.com/4gMeV6gb7g6g7bG28c43S08',
  performer:  'https://buy.stripe.com/cNi00c6Ax2fqdA4fZ243S0a',
  quemado:    'https://buy.stripe.com/3cI6oAgb76vG0Ni00443S07',
  armonia:    'https://buy.stripe.com/6oU7sE1gd7zKgMg5ko43S09',
};

export default function QuizResultsView({
  archetype,
  indicadores,
  email,
}: {
  archetype: ArchetypeId;
  indicadores: ArchetypeIndicators | null;
  email: string;
}) {
  const data = ARCHETYPES_FULL[archetype];
  const stripeLink = STRIPE_LINKS[archetype];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-block p-4 rounded-full mb-6 relative">
          <Image src="/logo-icon.png" alt="" width={112} height={112} className="object-contain" />
        </div>
        <p className="text-primary tracking-[0.3em] font-subtitle font-bold text-sm mb-2">RESULTADO OBTENIDO</p>
        <h2 className="text-4xl md:text-5xl font-title mb-2 italic text-text">{data.title}</h2>
        {data.subtitle && (
          <p className="text-text-muted text-lg font-body mb-2">{data.subtitle}</p>
        )}
        <p className="text-text-muted max-w-lg mx-auto text-lg font-body italic">&quot;{data.status}&quot;</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recomendación Binaural */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Tu Recomendación Binaural</h3>
          </div>
          <h4 className="font-title text-text mb-3">{data.binauralRecommendation.title}</h4>
          <p className="text-text-muted font-body text-sm leading-relaxed mb-4">
            {data.binauralRecommendation.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {data.binauralRecommendation.waves.map((wave) => (
              <span
                key={wave}
                className="px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-subtitle font-bold"
              >
                Ondas {wave}
              </span>
            ))}
          </div>

          {/* ── Leyenda parpadeante ── */}
          <motion.p
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              color: '#f59e0b',
              textShadow: '0 0 8px rgba(245,158,11,0.55)',
            }}
            className="text-xs font-subtitle font-bold mb-3"
          >
            ⭐ Usuarios con este perfil suelen comenzar con esta sesión.
          </motion.p>

          {/* ── Botón Stripe ── */}
          <a
            href={stripeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center px-6 py-3 rounded-xl font-subtitle font-bold text-sm transition-all"
            style={{
              background: '#f59e0b',
              color: '#000',
              boxShadow: '0 0 18px rgba(245,158,11,0.5)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                '0 0 28px rgba(245,158,11,0.75)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                '0 0 18px rgba(245,158,11,0.5)';
            }}
          >
            Descarga este audio · $7 USD
          </a>
          <p className="text-xs text-text-muted font-body text-center mt-2">
            Este audio forma parte de tu protocolo completo de 5 audios personalizados.
          </p>
        </div>

        {/* Mapa de Estado */}
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

      {/* ── Bloque protocolo completo ── */}
      <div
        className="p-6 rounded-2xl mb-8"
        style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}
      >
        <h3 className="font-title text-lg text-text mb-1">Tu protocolo binaural personalizado Oaureal</h3>
        <p className="text-text-muted font-body text-sm leading-relaxed mb-5">
          Diseñado según la combinación específica de ondas que tu sistema necesita priorizar ahora.
        </p>

        {/* Lo que este protocolo busca facilitar */}
        <h4
          className="font-subtitle text-sm font-bold mb-3"
          style={{ color: '#f59e0b' }}
        >
          Lo que este protocolo busca facilitar en tu sistema según tu resultado
        </h4>
        <ul className="space-y-2 text-sm font-body mb-4">
          {[
            'Reducir la sobrecarga mental progresivamente',
            'Recuperar claridad sin perder rendimiento',
            'Entrar en estados de calma funcional cuando lo necesites',
            'Dormir y recuperarte con mayor profundidad',
            'Regular tu energía mental durante el día',
          ].map((item, i) => (
            <li
              key={i}
              className="flex gap-2"
              style={{
                color: '#f59e0b',
                textShadow: '0 0 6px rgba(245,158,11,0.35)',
              }}
            >
              <span className="mt-0.5 shrink-0">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p
          className="text-sm mb-6"
          style={{ color: 'rgba(245,158,11,0.7)', fontFamily: 'monospace' }}
        >
          Para acompañar este proceso, diseñamos tu protocolo binaural personalizado.
        </p>

        {/* ¿Qué incluye? */}
        <h4 className="font-subtitle text-primary text-sm mb-3">¿Qué incluye?</h4>
        <ul className="space-y-3 text-sm font-body text-text-muted mb-6">
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
        </ul>

        {/* Pills de resultados */}
        <h4 className="font-subtitle text-primary text-sm mb-3">Resultados</h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Mayor calma', 'Enfoque más estable', 'Descanso más profundo'].map((r) => (
            <span
              key={r}
              className="px-4 py-1.5 rounded-full text-xs font-subtitle font-bold"
              style={{
                color: '#78e8f8',
                border: '1px solid rgba(120,232,248,0.4)',
                background: 'rgba(120,232,248,0.08)',
                textShadow: '0 0 8px rgba(120,232,248,0.6)',
                boxShadow: '0 0 10px rgba(120,232,248,0.15)',
              }}
            >
              {r}
            </span>
          ))}
        </div>

        {/* Precio */}
        <div className="text-center mb-5">
          <p className="text-text-muted font-body text-sm mb-1">Inversión</p>
          <p className="text-3xl font-title text-text">$32 USD</p>
          <p className="text-text-secondary text-sm font-body mt-1">Pago único · Sin suscripciones</p>
        </div>

        {/* Badge "Entrega hoy" */}
        <div className="flex justify-center mb-3">
          <motion.span
            animate={{ opacity: [1, 0.45, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-subtitle font-bold"
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.5)',
              color: '#f87171',
              textShadow: '0 0 8px rgba(239,68,68,0.7)',
              boxShadow: '0 0 12px rgba(239,68,68,0.25)',
            }}
          >
            ● Entrega hoy
          </motion.span>
        </div>

        {/* Contador social proof */}
        <SocialProofCounter />

        {/* Botón WhatsApp ámbar */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '528117879315'}?text=${encodeURIComponent(`Hola, acabo de completar el test en la web de Oaureal.\n\nMi resultado fue: ${data.title}.\nMi correo: ${email}\n\nQuiero mi protocolo personalizado y que me guíen con el proceso de pago. Gracias.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-10 py-5 rounded-xl font-subtitle font-bold text-lg transition-all"
          style={{
            background: '#f59e0b',
            color: '#000',
            boxShadow: '0 0 28px rgba(245,158,11,0.6), 0 0 60px rgba(245,158,11,0.2)',
            letterSpacing: '0.05em',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              '0 0 40px rgba(245,158,11,0.85), 0 0 80px rgba(245,158,11,0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              '0 0 28px rgba(245,158,11,0.6), 0 0 60px rgba(245,158,11,0.2)';
          }}
        >
          ACTIVAR AHORA →
        </a>

        {/* Textos post-botón en ámbar */}
        <div className="mt-5 space-y-2 text-center">
          <p
            className="text-sm font-subtitle font-bold"
            style={{ color: '#f59e0b', textShadow: '0 0 8px rgba(245,158,11,0.5)' }}
          >
            Tu protocolo está listo. Solo falta activarlo. Tu sistema nervioso está en el estado ideal para empezar hoy.
          </p>
          <p
            className="text-sm font-body"
            style={{ color: '#fbbf24' }}
          >
            Escríbenos por WhatsApp y te guiamos en el pago. Te enviamos tu protocolo ese mismo día.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
