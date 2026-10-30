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
function ProtocolCTA({ stripeLink }: { stripeLink: string }) {
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
              href={stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                boxShadow: '0 0 50px rgba(255,179,0,0.75), 0 0 100px rgba(255,179,0,0.35)',
                y: -2,
              }}
              onClick={() => window.gtag?.('event', 'checkout_initiated')}
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
              ACTIVAR MI PROTOCOLO · $19 USD →
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
          text="Pago seguro vía Stripe. Acceso inmediato tras confirmar tu compra."
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

// ─── Stripe links · Protocolo completo $19 ───────────────────────────────────
// 1. El que no ha podido parar  → exhausto
// 2. El que no logra descansar  → insomne
// 3. La mente inquieta          → ansioso
// 4. El protector interno       → protector
// 5. La mente abierta           → disperso
// 6. El de alto ritmo           → performer
// 7. El sistema sobrecargado    → quemado
// 8. El buscador de armonía     → armonia
const STRIPE_LINKS_FULL: Record<ArchetypeId, string> = {
  exhausto:  'https://buy.stripe.com/aFa5kw6Ax6vGeE8eUY43S0m',
  insomne:   'https://buy.stripe.com/dRm14g4spaLW53y9AE43S0n',
  ansioso:   'https://buy.stripe.com/8x200c2kh7zKgMgdQU43S0o',
  protector: 'https://buy.stripe.com/4gM6oA0c9f2c0Ni7sw43S0l',
  disperso:  'https://buy.stripe.com/cNieV68IF7zK3Zu4gk43S0p',
  performer: 'https://buy.stripe.com/7sY28k5wt2fq2VqaEI43S0q',
  quemado:   'https://buy.stripe.com/00w5kw4sp6vG3Zu6os43S0r',
  armonia:   'https://buy.stripe.com/bJe5kwf736vGfIc9AE43S0s',
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
// ─── Muestra de audio + vista previa estática de la página de entrega ─────────
// Audio: define NEXT_PUBLIC_DEMO_AUDIO_URL en .env (si no existe, usa el blob de demo).
// La vista previa es un ejemplo fijo (arquetipo #1) y NO es interactiva: sin play ni descargas.
const DEMO_AUDIO_URL =
  process.env.NEXT_PUBLIC_DEMO_AUDIO_URL ??
  'https://gtdviho4qauxvfot.public.blob.vercel-storage.com/demo.mp3';

const PREVIEW_AUDIOS = [
  'Transición al Descanso Profundo',
  'Liberación de Carga Mental',
  'Soltar y Fluir',
  'Presencia Serena',
  'Claridad Sostenida',
];

function SampleAndPreview() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const played = useRef(false);

  const open = () => {
    window.gtag?.('event', 'preview_open');
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const serif = "'Cormorant Garamond', Georgia, serif";
  const mono = "'DM Mono', ui-monospace, monospace";
  const cy = '#00f5ff';

  return (
    <div
      style={{
        marginBottom: 20,
        padding: '16px 20px',
        borderRadius: 12,
        background: 'rgba(0,229,255,0.05)',
        border: '1px solid rgba(0,229,255,0.3)',
      }}
    >
      <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, color: '#00e5ff', textTransform: 'uppercase', marginBottom: 6 }}>
        Escucha una muestra
      </p>
      <p className="text-text-muted font-body text-xs leading-relaxed mb-3">
        Así suena una sesión de tu protocolo. Usa audífonos y escúchala con calma.
      </p>
      <audio
        controls
        preload="none"
        controlsList="nodownload"
        src={DEMO_AUDIO_URL}
        style={{ width: '100%', height: 40, marginBottom: 8 }}
        onPlay={() => {
          if (played.current) return;
          played.current = true;
          window.gtag?.('event', 'demo_play');
        }}
      />
      <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#6b7280', marginBottom: 12 }}>
        Es una muestra de ejemplo. Tus sesiones se construyen a partir de tu perfil. La respuesta a los audios varía entre personas.
      </p>
      <button
        type="button"
        onClick={open}
        style={{
          width: '100%',
          background: 'transparent',
          color: '#00e5ff',
          border: '1px solid #00e5ff',
          borderRadius: 10,
          padding: 11,
          fontFamily: 'monospace',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        Ver cómo se ve tu protocolo →
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Vista previa de tu protocolo"
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        style={{
          width: 'min(580px, 94vw)',
          maxHeight: '92vh',
          overflow: 'auto',
          background: '#050505',
          color: '#f0f8ff',
          border: '1px solid rgba(0,229,255,0.4)',
          borderRadius: 14,
          padding: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: mono, fontSize: 11, color: '#8a9a9f', lineHeight: 1.4 }}>
            Así se ve la página que recibes al activar tu protocolo. Es una muestra, no es interactiva.
          </span>
          <button
            type="button"
            onClick={close}
            style={{ flex: 'none', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#f0f8ff', borderRadius: 8, padding: '6px 10px', fontFamily: mono, fontSize: 11, cursor: 'pointer' }}
          >
            Cerrar ✕
          </button>
        </div>

        {/* Marco estático: pointer-events none, nada responde a clics */}
        <div
          role="img"
          aria-label="Vista previa de la página de entrega: encabezado, cinco audios y recursos en PDF"
          style={{
            position: 'relative',
            background: '#000',
            border: '1px solid rgba(0,245,255,0.22)',
            borderRadius: 12,
            overflow: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: serif,
            backgroundImage:
              'linear-gradient(rgba(0,245,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: 'rgba(0,245,255,.1)', borderBottom: '1px solid rgba(0,245,255,.25)', fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: cy }}>
            <span>Vista previa</span>
            <span style={{ opacity: 0.6 }}>Datos de muestra</span>
          </div>
          <div aria-hidden style={{ position: 'absolute', zIndex: 4, top: '42%', left: '50%', transform: 'translate(-50%,-50%) rotate(-14deg)', fontFamily: mono, fontSize: 30, letterSpacing: '0.3em', color: 'rgba(0,245,255,.08)', whiteSpace: 'nowrap' }}>
            MUESTRA
          </div>

          <div style={{ position: 'relative', zIndex: 1, padding: '24px 18px 20px' }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: cy, opacity: 0.8, textAlign: 'center' }}>Oaureal</div>
            <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(22px,5vw,28px)', lineHeight: 1.15, textAlign: 'center', margin: '12px 0 6px', textShadow: '0 0 30px rgba(0,245,255,.2)' }}>
              #1 El que no ha podido parar
            </h3>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,245,255,.5)', textAlign: 'center' }}>
              Tu protocolo binaural personalizado
            </div>
            <div style={{ width: 90, height: 1, margin: '16px auto', background: `linear-gradient(90deg, transparent, ${cy}, transparent)` }} />
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(240,248,255,.75)', textAlign: 'center', margin: '0 0 8px' }}>
              Este espacio contiene los audios que forman parte de tu protocolo binaural personalizado. Fueron diseñados para crear un entorno sonoro que acompañe procesos de regulación a lo largo del día.
            </p>
            <p style={{ fontSize: 14, fontStyle: 'italic', color: cy, textAlign: 'center', margin: '0 0 18px', opacity: 0.9 }}>
              No es consumo pasivo. Es práctica sostenida.
            </p>

            <div style={{ position: 'relative', border: '1px solid rgba(0,245,255,.14)', background: 'rgba(0,245,255,.04)', padding: '14px 16px 14px 18px', marginBottom: 20 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 3, height: '100%', background: cy, boxShadow: '0 0 10px rgba(0,245,255,.4)' }} />
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: cy, opacity: 0.8, marginBottom: 6 }}>Antes de comenzar</div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: 'rgba(240,248,255,.7)' }}>
                La guía del protocolo en PDF está al final de esta página, lista para leer y descargar. Te recomendamos revisarla primero: ahí encontrarás la estructura de uso, prácticas y recomendaciones que acompañan estos audios.
              </p>
            </div>

            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(0,245,255,.5)', textAlign: 'center', margin: '6px 0 14px' }}>— Protocolo de audio —</div>
            {PREVIEW_AUDIOS.map((title, i) => (
              <div key={title} style={{ border: `1px solid ${i === 0 ? 'rgba(0,245,255,.3)' : 'rgba(0,245,255,.14)'}`, background: i === 0 ? 'rgba(0,245,255,.05)' : 'rgba(0,245,255,.03)', padding: '13px 16px', marginBottom: 10, display: 'grid', gridTemplateColumns: '1fr 100px', gap: '4px 14px', alignItems: 'center' }}>
                <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: cy, opacity: 0.8 }}>Audio 0{i + 1}</div>
                <svg viewBox="0 0 110 34" aria-hidden style={{ gridRow: '1 / 3', gridColumn: 2, width: 100, height: 32 }}>
                  <path d={`M0 17 C10 ${3 + i},20 ${31 - i},30 17 S50 ${3 + i},60 17 S80 ${31 - i},90 17 S105 8,110 17`} fill="none" stroke={cy} strokeWidth="1.5" />
                  <path d="M0 17 C12 10,22 24,34 17 S56 10,66 17 S88 24,110 17" fill="none" stroke={cy} strokeOpacity=".35" />
                </svg>
                <div style={{ fontFamily: serif, fontSize: 18, lineHeight: 1.2 }}>{title}</div>
              </div>
            ))}

            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(0,245,255,.5)', textAlign: 'center', margin: '22px 0 14px' }}>— Recursos descargables —</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { icon: '📄', label: 'Guía del Protocolo PDF', text: 'Tu guía completa de uso: estructura de sesiones, técnicas de respiración y recomendaciones para integrar los audios en tu día.' },
                { icon: '📋', label: 'Habit & Mood Tracker PDF', text: 'Registro imprimible para rastrear tu estado de ánimo y hábitos durante las próximas semanas. Imprímelo y úsalo junto con tus audios.' },
              ].map((r) => (
                <div key={r.label} style={{ position: 'relative', border: '1px solid rgba(0,245,255,.14)', background: 'rgba(0,245,255,.03)', padding: '16px 16px 14px 18px' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: 2, height: '100%', background: cy, boxShadow: '0 0 8px rgba(0,245,255,.35)' }} />
                  <div>{r.icon}</div>
                  <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: cy, margin: '4px 0 8px' }}>{r.label}</div>
                  <p style={{ margin: '0 0 10px', fontFamily: mono, fontSize: 11, lineHeight: 1.65, color: 'rgba(240,248,255,.55)' }}>{r.text}</p>
                  <span style={{ display: 'inline-block', fontFamily: mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(0,245,255,.7)', border: '1px dashed rgba(0,245,255,.3)', padding: '4px 8px' }}>PDF incluido</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, textAlign: 'center', fontFamily: mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,245,255,.3)' }}>Oaureal · Protocolo Personalizado</div>
          </div>
          <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, background: 'linear-gradient(transparent, #000 85%)', zIndex: 3 }} />
        </div>
      </dialog>
    </div>
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
  const stripeLinkFull = STRIPE_LINKS_FULL[archetype];
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
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
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
          <h3 className="font-title text-lg text-text mb-1">Tu Siguiente Paso</h3>
          <p className="text-text-muted font-body text-sm leading-relaxed mb-5">
            Lleva tu resultado a una práctica personalizada
          </p>

          {/* TU SIGUIENTE PASO — reutiliza las 3 prioridades ya personalizadas del arquetipo */}
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
              Tu evaluación identificó tres áreas prioritarias
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
              {data.protocol.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ fontFamily: 'monospace', fontSize: 12, color: '#f59e0b', marginBottom: 8 }}
                >
                  {item.icon} {item.goal}
                </motion.li>
              ))}
            </ul>
            <GlowPulseTextAmber>
              Tu protocolo binaural fue diseñado para acompañar estas tres áreas mediante una secuencia adaptada a tu perfil.
            </GlowPulseTextAmber>
          </div>

          {/* ¿Qué vas a recibir? */}
          <h4 className="font-subtitle text-primary text-sm mb-3">¿Qué vas a recibir?</h4>
          <ul className="space-y-3 text-sm font-body text-text-muted mb-3">
            {[
              { icon: '🎧', text: 'Tu secuencia binaural personalizada. Sesiones construidas a partir de las ondas que tu perfil necesita.' },
              { icon: '📖', text: 'Guía de práctica. Cuándo usar cada sesión y cómo integrarla a tu rutina.' },
              { icon: '📓', text: 'Plantilla de seguimiento imprimible. Registro de hábitos y emociones.' },
            ].map((item, i) => (
              <motion.li
                key={i}
                className="flex gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-primary">{item.icon}</span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 20 }}>
            Tus sesiones se entregan en formato WAV de alta fidelidad, sin compresión.
          </p>

          {/* NUEVO: muestra de audio + vista previa de la entrega */}
          <SampleAndPreview />

          {/* BONUS DE ACTIVACIÓN — reutiliza el reto/quest ya personalizado del arquetipo */}
          <div
            style={{
              marginBottom: 20,
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(245,158,11,0.06)',
              border: '1px dashed rgba(245,158,11,0.4)',
            }}
          >
            <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 6 }}>
              Bonus de activación
            </p>
            <p className="font-title text-text text-sm mb-2">15 días de {data.quest.title}</p>
            <p className="text-text-muted font-body text-xs leading-relaxed">
              Durante tus primeros 15 días: {data.quest.mission}. Esto te ayuda a observar tu evolución antes y después de escuchar tu protocolo.
            </p>
          </div>

          {/* LO QUE VAS A PRACTICAR — varía por arquetipo */}
          <div style={{ marginTop: 16, marginBottom: 8 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
              Lo que vas a practicar
            </p>
            <div className="space-y-3">
              {data.oferta.practica.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  style={{
                    border: '1px solid rgba(245,158,11,0.25)',
                    background: 'rgba(245,158,11,0.05)',
                    borderRadius: 10,
                    padding: '10px 14px',
                  }}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 2 }}>{item.title}</p>
                  <p className="text-text-muted font-body text-xs leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Garantía — Fase 4 */}
          <div
            style={{
              marginTop: 20,
              marginBottom: 8,
              padding: '14px 18px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: '#e5e7eb', marginBottom: 4 }}>
              🛡️ Garantía de 15 días
            </p>
            <p className="text-text-muted font-body text-xs leading-relaxed">{data.oferta.garantia}</p>
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
              $19 USD
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
          <ProtocolCTA stripeLink={stripeLinkFull} />
        </div>
      </RevealBlock>
    </motion.div>
  );
}
