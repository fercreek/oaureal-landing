'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform } from 'framer-motion';
import { Brain, Zap, Target, AlertTriangle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ARCHETYPES_FULL, type ArchetypeId, type ArchetypeIndicators } from '@/lib/quiz-logic';

// ─── Social proof count (deterministic by day, spec formula) ─────────────────
function getSocialProofTarget(): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const totalDays = new Date(y, m + 1, 0).getDate();
  const progress = (d - 1) / Math.max(totalDays - 1, 1);
  const rand = Math.abs(
    (Math.sin((y * 10000 + m * 100 + d) * 127.1) * 43758.5453) % 1
  );
  return Math.min(97, Math.round(20 + progress * 72 + rand * 6));
}

// ─── Animated count-up number (RAF + easeOutExpo, spec-compliant) ────────────
function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayed, setDisplayed] = useState(0);
  const [glowing, setGlowing] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isInView || hasRun.current) return;
    hasRun.current = true;

    const duration = 2200;
    const startTime = performance.now();

    const easeOutExpo = (t: number) =>
      t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    let raf: number;
    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      setDisplayed(Math.round(easeOutExpo(t) * target));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplayed(target);
        scheduleIncrement(target);
      }
    };
    raf = requestAnimationFrame(step);

    let incrementTimeout: ReturnType<typeof setTimeout>;
    const scheduleIncrement = (current: number) => {
      if (current >= 100) return;
      incrementTimeout = setTimeout(() => {
        const next = current + 1;
        setDisplayed(next);
        setGlowing(true);
        setTimeout(() => setGlowing(false), 500);
        scheduleIncrement(next);
      }, 18000 + Math.random() * 28000);
    };

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(incrementTimeout);
    };
  }, [isInView, target]);

  return (
    <span
      ref={ref}
      style={{
        fontSize: 28,
        fontWeight: 700,
        fontFamily: 'monospace',
        fontVariantNumeric: 'tabular-nums',
        minWidth: 40,
        display: 'inline-block',
        color: '#00e5ff',
        textShadow: glowing
          ? '0 0 30px #00e5ff, 0 0 60px rgba(0,229,255,0.6)'
          : '0 0 16px rgba(0,229,255,0.4)',
        transition: 'text-shadow 0.5s ease',
      }}
    >
      {displayed}
    </span>
  );
}

// ─── Social proof counter widget ─────────────────────────────────────────────
function SocialProofCounter() {
  const [target, setTarget] = useState<number | null>(null);
  useEffect(() => { setTarget(getSocialProofTarget()); }, []);
  if (target === null) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
      <AnimatedCounter target={target} />
      <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>
        personas han activado su protocolo este mes
      </span>
    </div>
  );
}

// ─── Animated progress bar (Framer Motion, no CSS transition on fill) ────────
interface ProgressBarProps {
  color: 'cyan' | 'amber';
  label: string;
  subLabel: string;
  duration: number; // ms
  onComplete: () => void;
  trigger: boolean;
}

function ProgressBar({ color, label, subLabel, duration, onComplete, trigger }: ProgressBarProps) {
  const progress = useMotionValue(0);
  const width = useTransform(progress, [0, 1], ['0%', '100%']);
  const pct = useTransform(progress, (v: number) => `${Math.round(v * 100)}%`);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;

    // Custom easing: slow → accelerate → hesitate at 88% → snap to 100%
    const easeBar = (t: number) => {
      if (t < 0.5) return 1.8 * t * t;
      if (t < 0.88) return -1 + (3.6 - 1.8 * t) * t;
      return 0.91 + (t - 0.88) * 0.75;
    };

    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = Math.min(easeBar(t), 1);
      progress.set(eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        progress.set(1);
        setTimeout(onComplete, 280);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, duration, onComplete, progress]);

  const isAmber = color === 'amber';
  const mainColor = isAmber ? '#ffb300' : '#00e5ff';
  const gradient = isAmber
    ? 'linear-gradient(90deg, #ffb300, #ff6b00)'
    : 'linear-gradient(90deg, #00e5ff, #7c3aed)';
  const glowShadow = isAmber
    ? '0 0 10px rgba(255,179,0,0.5)'
    : undefined;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: mainColor, whiteSpace: 'nowrap' }}>
          {label}
        </span>
        <div style={{
          flex: 1, height: 5,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 10, overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%',
              width,
              background: gradient,
              borderRadius: 10,
              boxShadow: glowShadow,
            }}
          />
        </div>
        <motion.span
          style={{ fontFamily: 'monospace', fontSize: 11, color: mainColor, minWidth: 34, textAlign: 'right' }}
        >
          {pct}
        </motion.span>
      </div>
      <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
        {subLabel}
      </p>
    </div>
  );
}

// ─── Audio CTA block (after binaural recommendation) ─────────────────────────
function AudioCTA({ stripeLink }: { stripeLink: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');

  const handleComplete = useCallback(() => {
    setPhase('ready');
  }, []);

  return (
    <div ref={ref} style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProgressBar
              color="cyan"
              label="⚡ Creando tu audio..."
              subLabel="Estamos generando este audio en unos segundos..."
              duration={3400}
              trigger={isInView}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ textAlign: 'center' }}
          >
            {/* Blinking star label */}
            <motion.p
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.49, 0.5, 0.99, 1] }}
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#ffb300',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              ⭐ Usuarios con este perfil suelen comenzar con esta sesión.
            </motion.p>

            {/* Download button */}
            <motion.a
              href={stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                boxShadow: '0 0 32px rgba(255,179,0,0.75), 0 0 60px rgba(255,179,0,0.3)',
                y: -2,
              }}
              style={{
                display: 'inline-block',
                background: '#ffb300',
                color: '#000',
                fontWeight: 800,
                fontSize: 15,
                padding: '14px 32px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(255,179,0,0.5), 0 0 40px rgba(255,179,0,0.2)',
              }}
            >
              Descarga este audio · $7 USD
            </motion.a>
            <p style={{ marginTop: 10, fontFamily: 'monospace', fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
              Este audio forma parte de tu protocolo completo de 5 audios personalizados.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text: string, speed: number, active: boolean, onDone?: () => void) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      if (i < text.length) {
        const char = text[i++];
        setDisplayed((prev) => prev + char);
        timeout = setTimeout(type, speed + Math.random() * 18);
      } else {
        setTimeout(() => {
          setDone(true);
          onDone?.();
        }, 500);
      }
    };
    timeout = setTimeout(type, speed);
    return () => clearTimeout(timeout);
  }, [active, text, speed, onDone]);

  return { displayed, done };
}

// ─── Typewriter line with blinking cursor ────────────────────────────────────
function TypewriterLine({
  text,
  active,
  onDone,
}: {
  text: string;
  active: boolean;
  onDone?: () => void;
}) {
  const { displayed, done } = useTypewriter(text, 30, active, onDone);

  return (
    <p
      style={{
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#ffb300',
        lineHeight: 1.9,
        textShadow: '0 0 14px rgba(255,179,0,0.5)',
        marginBottom: 2,
      }}
    >
      {displayed}
      {active && !done && (
        <motion.span
          animate={{ opacity: [1, 1, 0, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear', times: [0, 0.49, 0.5, 0.99, 1] }}
          style={{
            display: 'inline-block',
            width: 2,
            height: 13,
            background: '#ffb300',
            marginLeft: 2,
            verticalAlign: 'middle',
          }}
        />
      )}
    </p>
  );
}

// ─── Protocol CTA block (full purchase section) ───────────────────────────────
function ProtocolCTA({ whatsappHref }: { whatsappHref: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const [line1Active, setLine1Active] = useState(false);
  const [line2Active, setLine2Active] = useState(false);

  const handleBarComplete = useCallback(() => {
    setPhase('ready');
    setTimeout(() => setLine1Active(true), 800);
  }, []);

  const handleLine1Done = useCallback(() => {
    setTimeout(() => setLine2Active(true), 250);
  }, []);

  return (
    <div ref={ref} id="protocolCTAWrap">
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            key="bar"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ textAlign: 'center', marginBottom: 18 }}
          >
            <div style={{ maxWidth: 440, margin: '0 auto' }}>
              <ProgressBar
                color="amber"
                label="🔒 Preparando tu protocolo..."
                subLabel="Verificando tu perfil y frecuencias asignadas..."
                duration={4200}
                trigger={isInView}
                onComplete={handleBarComplete}
              />
            </div>
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ textAlign: 'center', marginBottom: 18 }}
          >
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                boxShadow: '0 0 50px rgba(255,179,0,0.75), 0 0 100px rgba(255,179,0,0.35)',
                y: -2,
              }}
              className="block w-full font-subtitle font-bold uppercase"
              style={{
                display: 'inline-block',
                background: '#ffb300',
                color: '#000',
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: '0.05em',
                padding: '18px 48px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                maxWidth: 440,
                textDecoration: 'none',
                boxShadow:
                  '0 0 28px rgba(255,179,0,0.5), 0 0 60px rgba(255,179,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              ACTIVAR AHORA →
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typewriter lines — always mounted, appear after phase = ready */}
      <div style={{ textAlign: 'center', minHeight: 64 }}>
        <TypewriterLine
          text="Tu protocolo está listo. Solo falta activarlo. Tu sistema nervioso está en el estado ideal para empezar hoy."
          active={line1Active}
          onDone={handleLine1Done}
        />
        <TypewriterLine
          text="Escríbenos por WhatsApp y te guiamos en el pago. Te enviamos tu protocolo ese mismo día."
          active={line2Active}
        />
      </div>
    </div>
  );
}

// ─── Radar helpers ────────────────────────────────────────────────────────────
function createRadarPath(data: { value: number }[]) {
  const center = 100;
  const maxRadius = 80;
  const angleStep = (2 * Math.PI) / data.length;
  const points = data.map((item, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const radius = (item.value / 100) * maxRadius;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
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
      return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
    });
    return points.join(' ');
  });
}

// ─── Indicator labels ─────────────────────────────────────────────────────────
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

// ─── Stripe links ─────────────────────────────────────────────────────────────
const STRIPE_LINKS: Record<ArchetypeId, string> = {
  exhausto:  'https://buy.stripe.com/6oU7sE1gd7zKgMg5ko43S09',
  insomne:   'https://buy.stripe.com/3cI6oAgb76vG0Ni00443S07',
  ansioso:   'https://buy.stripe.com/4gMeV6gb7g6g7bG28c43S08',
  protector: 'https://buy.stripe.com/6oU7sE1gd7zKgMg5ko43S09',
  disperso:  'https://buy.stripe.com/4gMeV6gb7g6g7bG28c43S08',
  performer: 'https://buy.stripe.com/cNi00c6Ax2fqdA4fZ243S0a',
  quemado:   'https://buy.stripe.com/3cI6oAgb76vG0Ni00443S07',
  armonia:   'https://buy.stripe.com/6oU7sE1gd7zKgMg5ko43S09',
};

// ─── Animated indicator bar ───────────────────────────────────────────────────
function IndicatorBar({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />
    </div>
  );
}

// ─── Animated radar polygon ───────────────────────────────────────────────────
function AnimatedRadar({ data }: { data: { label: string; value: number }[] }) {
  const ref = useRef<SVGPolygonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(svgRef, { once: true, amount: 0.5 });
  const [animatedData, setAnimatedData] = useState(data.map((d) => ({ ...d, value: 0 })));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, 1, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setAnimatedData(data.map((d) => ({ ...d, value: d.value * v })));
      },
    });
    return () => controls.stop();
  }, [isInView, data]);

  return (
    <svg ref={svgRef} viewBox="0 0 200 200" className="w-full max-w-[240px] mx-auto">
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
      {data.map((_, i) => {
        const angleStep = (2 * Math.PI) / data.length;
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1="100" y1="100"
            x2={100 + 80 * Math.cos(angle)}
            y2={100 + 80 * Math.sin(angle)}
            stroke="var(--color-primary)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        ref={ref}
        points={createRadarPath(animatedData)}
        fill="var(--color-primary)"
        fillOpacity="0.2"
        stroke="var(--color-primary)"
        strokeWidth="2"
      />
      {data.map((item, i) => {
        const angleStep = (2 * Math.PI) / data.length;
        const angle = angleStep * i - Math.PI / 2;
        return (
          <text
            key={i}
            x={100 + 95 * Math.cos(angle)}
            y={100 + 95 * Math.sin(angle)}
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
  );
}

// ─── Stagger reveal wrapper ───────────────────────────────────────────────────
function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Glow pulse text ──────────────────────────────────────────────────────────
function GlowPulseText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.p
      animate={{
        textShadow: [
          '0 0 8px rgba(0,229,255,0.4), 0 0 16px rgba(0,229,255,0.2)',
          '0 0 16px rgba(0,229,255,0.8), 0 0 32px rgba(0,229,255,0.4)',
          '0 0 8px rgba(0,229,255,0.4), 0 0 16px rgba(0,229,255,0.2)',
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ fontStyle: 'italic', fontFamily: 'monospace', fontSize: 12, color: '#00e5ff', textAlign: 'center', lineHeight: 1.7, ...style }}
    >
      {children}
    </motion.p>
  );
}

function GlowPulseTextAmber({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      animate={{
        textShadow: [
          '0 0 8px rgba(245,158,11,0.3), 0 0 16px rgba(245,158,11,0.15)',
          '0 0 16px rgba(245,158,11,0.7), 0 0 32px rgba(245,158,11,0.35)',
          '0 0 8px rgba(245,158,11,0.3), 0 0 16px rgba(245,158,11,0.15)',
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ fontStyle: 'italic', fontFamily: 'monospace', fontSize: 12, color: '#f59e0b', textAlign: 'left', lineHeight: 1.7 }}
    >
      {children}
    </motion.p>
  );
}
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
  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '528117879315'}?text=${encodeURIComponent(
    `Hola, acabo de completar el test en la web de Oaureal.\n\nMi resultado fue: ${data.title}.\nMi correo: ${email}\n\nQuiero mi protocolo personalizado y que me guíen con el proceso de pago. Gracias.`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block p-4 rounded-full mb-6 relative"
        >
          <Image src="/logo-icon.png" alt="" width={112} height={112} className="object-contain" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-primary tracking-[0.3em] font-subtitle font-bold text-sm mb-2"
        >
          RESULTADO OBTENIDO
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-title mb-2 italic text-text"
        >
          {data.title}
        </motion.h2>
        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-text-muted text-lg font-body mb-2"
          >
            {data.subtitle}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="text-text-muted max-w-lg mx-auto text-lg font-body italic"
        >
          &quot;{data.status}&quot;
        </motion.p>
      </div>

      {/* ── Top grid: Binaural + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Recomendación Binaural */}
        <RevealBlock delay={0.1}>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col h-full">
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

            {/* Audio CTA: leyenda parpadeante + barra de progreso + botón */}
            <AudioCTA stripeLink={stripeLink} />
          </div>
        </RevealBlock>

        {/* Mapa de Estado */}
        <RevealBlock delay={0.2}>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-full">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-title text-lg text-text">Mapa de Estado</h3>
            </div>
            <div className="flex justify-center">
              <AnimatedRadar data={data.radarStats} />
            </div>
          </div>
        </RevealBlock>
      </div>

      {/* ── Indicadores Clave ── */}
      {indicadores && Object.keys(indicadores).length > 0 && (
        <RevealBlock>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-title text-lg text-text">Indicadores Clave</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(indicadores).map(([key, stat], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-muted font-body capitalize">
                      {INDICATOR_LABELS[key] ?? key}
                    </span>
                    {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-primary" />}
                    {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-primary" />}
                    <motion.span
                      className="font-subtitle font-bold text-primary"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.4 }}
                    >
                      {stat.value}%
                    </motion.span>
                  </div>
                  <IndicatorBar value={stat.value} />
                </motion.div>
              ))}
            </div>
          </div>
        </RevealBlock>
      )}

      {/* ── Protocolo + Quest ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevealBlock delay={0.05}>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-title text-lg text-text">Tu Protocolo Personalizado</h3>
            </div>
            <div className="space-y-4">
              {data.protocol.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-subtitle text-primary mb-1">Prioridad {item.priority}</p>
                    <h4 className="font-title text-text text-sm mb-1">{item.goal}</h4>
                    <p className="text-text-muted font-body text-xs leading-relaxed">{item.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealBlock>

        <RevealBlock delay={0.1}>
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
        </RevealBlock>
      </div>

      {/* ── Alerta ── */}
      <RevealBlock>
        <div className="p-6 rounded-2xl bg-white/5 border border-primary/30 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Sistema de Alerta</h3>
          </div>
          <p className="text-text-muted font-body text-sm leading-relaxed">{data.warning}</p>
        </div>
      </RevealBlock>

      {/* ── Fortalezas + Diagnóstico ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevealBlock delay={0.05}>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-title text-lg text-text">Tus Fortalezas</h3>
            </div>
            <p className="text-text-muted font-body text-sm leading-relaxed">{data.fortalezas}</p>
          </div>
        </RevealBlock>

        <RevealBlock delay={0.1}>
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
        </RevealBlock>
      </div>

      {/* ── Acción Inmediata ── */}
      <RevealBlock>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-title text-lg text-text">Acción Inmediata</h3>
          </div>
          <p className="text-text-muted font-body text-sm leading-relaxed">{data.tip}</p>
        </div>
      </RevealBlock>

      {/* ── Bloque protocolo completo ── */}
      <RevealBlock>
        <div
          className="p-6 rounded-2xl mb-8"
          style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}
        >
          <h3 className="font-title text-lg text-text mb-1">Tu protocolo binaural personalizado Oaureal</h3>

          {/* Nuevo bloque: Lo que facilita — card con borde amber */}
          <div
            style={{
              marginBottom: 20,
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.25)',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 700, fontStyle: 'italic', color: '#f59e0b', marginBottom: 12 }}>
              Lo que este protocolo busca facilitar en tu sistema según tu resultado
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
              {[
                'Reducir la sobrecarga mental progresivamente',
                'Recuperar claridad sin perder rendimiento',
                'Entrar en estados de calma funcional cuando lo necesites',
                'Dormir y recuperarte con mayor profundidad',
                'Regular tu energía mental durante el día',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ fontFamily: 'monospace', fontSize: 12, color: '#f59e0b', marginBottom: 8 }}
                >
                  — {item}
                </motion.li>
              ))}
            </ul>
            <GlowPulseTextAmber>
              Para acompañar este proceso, diseñamos tu protocolo binaural personalizado.
            </GlowPulseTextAmber>
          </div>

          {/* Texto que se conserva */}
          <p className="text-text-muted font-body text-sm leading-relaxed mb-5">
            Diseñado según la combinación específica de ondas que tu sistema necesita priorizar ahora.
          </p>

          {/* ¿Qué incluye? */}
          <h4 className="font-subtitle text-primary text-sm mb-3">¿Qué incluye?</h4>
          <ul className="space-y-3 text-sm font-body text-text-muted mb-6">
            {[
              'Pack de audios binaurales personalizados. Frecuencias ajustadas a tu perfil.',
              'Audios en formato WAV (alta fidelidad). Sin compresión. Señal limpia y precisa.',
              'Guía de uso en PDF. Rutinas sugeridas, técnicas de respiración y prácticas de regulación.',
              'Plantilla de seguimiento imprimible. Registro de hábitos y emociones.',
            ].map((item, i) => (
              <motion.li
                key={i}
                className="flex gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-primary">✔</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          {/* Resultados — pills */}
          <div style={{ marginTop: 16, marginBottom: 8 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
              Resultados que muchas personas comienzan a notar con el uso constante:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Mayor calma', 'Enfoque más estable', 'Descanso más profundo'].map((r, i) => (
                <motion.span
                  key={r}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#f59e0b',
                    border: '1px solid rgba(245,158,11,0.4)',
                    background: 'rgba(245,158,11,0.08)',
                    borderRadius: 20,
                    padding: '5px 14px',
                    display: 'inline-block',
                  }}
                >
                  {r}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div className="text-center mb-5 mt-6">
            <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
              Inversión
            </p>
            <motion.p
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.1 }}
              className="text-text"
            >
              $32 USD
            </motion.p>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280', marginTop: 4 }}>
              Pago único · Sin suscripciones
            </p>
          </div>

          {/* Badge Entrega hoy */}
          <div className="flex justify-center mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-subtitle font-bold"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.5)',
                color: '#f87171',
                textShadow: '0 0 8px rgba(239,68,68,0.7)',
                boxShadow: '0 0 12px rgba(239,68,68,0.25)',
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1], boxShadow: ['0 0 8px #f87171', '0 0 3px #f87171', '0 0 8px #f87171'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 7, height: 7, background: '#f87171', borderRadius: '50%', display: 'inline-block' }}
              />
              Entrega hoy
            </span>
          </div>

          {/* Social proof counter */}
          <SocialProofCounter />

          {/* Protocol CTA — progress bar → ACTIVAR AHORA → typewriter */}
          <ProtocolCTA whatsappHref={whatsappHref} />
        </div>
      </RevealBlock>
    </motion.div>
  );
}
