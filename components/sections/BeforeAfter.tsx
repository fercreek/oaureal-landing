'use client';

import { useRef, useState, useCallback } from 'react';

/* ─── SVG icons ────────────────────────────────────── */
const IconSpiral = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7a5 5 0 1 0 5 5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <rect x="6" y="3" width="12" height="16" rx="2"/><path d="M10 3V1h4v2"/><path d="M9 10h6M9 13h4"/><path d="M6 19v2h12v-2"/>
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <path d="M3 12h2M19 12h2M12 3v2M12 19v2"/><path d="M5.6 5.6l1.4 1.4M16.9 16.9l1.5 1.5M5.6 18.4l1.4-1.4M16.9 7.1l1.5-1.5"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
  </svg>
);
const IconWave = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <path d="M2 12 Q5 5 8 12 Q11 19 14 12 Q17 5 20 12"/><path d="M20 12 Q21 9.5 22 12" opacity="0.5"/>
  </svg>
);
const IconRadiance = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.6"/>
  </svg>
);
const IconBulb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V17H9v-2.8A6 6 0 0 1 6 9a6 6 0 0 1 6-6z"/>
    <path d="M9.5 17h5" opacity="0.5"/>
  </svg>
);
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width={18} height={18}>
    <path d="M13 2L4 14h8l-1 8 9-12h-8l1-8z"/>
  </svg>
);
const IconToggleWave = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" width={22} height={22}>
    <path d="M2 12 Q5 5 8 12 Q11 19 14 12 Q17 5 20 12 Q21.5 15.5 22 12"/>
  </svg>
);

/* ─── data ───────────────────────────────────────────── */
const beforeItems = [
  { text: 'Mente que no para',     Icon: IconSpiral },
  { text: 'Cansancio acumulado',   Icon: IconDoc    },
  { text: 'Distracción constante', Icon: IconSun    },
  { text: 'Sueño que no recupera', Icon: IconMoon   },
];
const afterItems = [
  { text: 'Descanso profundo', Icon: IconWave    },
  { text: 'Enfoque sostenido', Icon: IconRadiance },
  { text: 'Claridad mental',   Icon: IconBulb    },
  { text: 'Recuperación real', Icon: IconZap     },
];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function BeforeAfter() {
  // 0 = virgen, 1 = before, 2 = after
  const [state, setState] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const rip  = document.createElement('div');
    const sz   = 60;
    rip.style.cssText = `position:absolute;border-radius:50%;background:rgba(120,232,248,0.15);animation:ba-ripple 0.7s ease-out forwards;width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px;pointer-events:none;`;
    trackRef.current!.appendChild(rip);
    setTimeout(() => rip.remove(), 800);
    setState(s => (s === 0 || s === 2) ? 1 : 2);
  }, []);

  const isAfter   = state === 2;
  const isVisible = state >= 1;
  const subLabel  = state === 0 ? 'descubre tu estado' : isAfter ? 'protocolo activado ✦' : 'así sin Oaureal';

  return (
    <>
      <style>{`
        @keyframes ba-ripple {
          from { transform:scale(0); opacity:1; }
          to   { transform:scale(6); opacity:0; }
        }

        /* section */
        .ba-section {
          position:relative; z-index:1;
          width:100%; display:flex; justify-content:center;
          padding:80px 40px 100px;
          background:var(--color-bg);
        }
        .ba-inner {
          width:100%; max-width:540px;
          display:flex; flex-direction:column; align-items:center;
        }

        /* eyebrow — font-subtitle, color-primary */
        .ba-eyebrow {
          font-family:var(--font-family-subtitle,'Exo 2',sans-serif);
          font-size:10px; font-weight:600; letter-spacing:4px;
          color:var(--color-primary); text-transform:uppercase;
          margin-bottom:16px;
          display:flex; align-items:center; justify-content:center; gap:14px;
          opacity:0.8;
        }
        .ba-eyebrow::before,.ba-eyebrow::after {
          content:''; width:28px; height:1px;
          background:linear-gradient(90deg,transparent,var(--color-primary));
        }
        .ba-eyebrow::after { transform:scaleX(-1); }

        /* title — font-title (Palatino), color-text */
        .ba-title {
          font-family:var(--font-family-title,'Palatino Linotype',serif);
          font-size:clamp(1.4rem,4vw,2rem); font-weight:400; font-style:italic;
          color:var(--color-text); text-align:center; line-height:1.3;
          margin-bottom:48px; letter-spacing:0.01em;
        }
        .ba-title span { color:var(--color-primary); font-style:normal; }

        /* toggle wrapper */
        .ba-toggle-wrapper { display:flex; flex-direction:column; align-items:center; gap:14px; margin-bottom:40px; }

        /* track */
        .ba-track {
          position:relative; width:248px; height:68px; border-radius:40px;
          background:rgba(120,232,248,0.03);
          border:1px solid rgba(120,232,248,0.18);
          cursor:pointer; overflow:hidden;
          box-shadow:0 0 0 1px rgba(120,232,248,0.06),0 0 32px rgba(120,232,248,0.06);
          transition:box-shadow 0.45s,border-color 0.45s;
          user-select:none; -webkit-tap-highlight-color:transparent;
        }
        .ba-track:hover {
          box-shadow:0 0 0 1px rgba(120,232,248,0.1),0 0 50px rgba(120,232,248,0.12);
        }
        .ba-track.is-after {
          border-color:rgba(120,232,248,0.45);
          box-shadow:0 0 0 1px rgba(120,232,248,0.15),0 0 60px rgba(120,232,248,0.2),0 0 100px rgba(120,232,248,0.06);
        }

        /* track labels */
        .ba-track-label {
          position:absolute; top:50%; transform:translateY(-50%);
          font-family:var(--font-family-title,'Palatino Linotype',serif);
          font-size:0.6rem; font-style:italic;
          letter-spacing:0.12em; text-transform:lowercase;
          pointer-events:none; z-index:1; transition:opacity 0.4s;
          opacity:0.7;
        }
        .ba-track-label-before { left:22px;  color:#e05555; }
        .ba-track-label-after  { right:22px; color:var(--color-primary); }
        .ba-track.is-after .ba-track-label-after        { opacity:0.25; }
        .ba-track:not(.is-after) .ba-track-label-before { opacity:0.25; }

        /* thumb */
        .ba-thumb {
          position:absolute; top:7px;
          width:54px; height:54px; border-radius:32px;
          display:flex; align-items:center; justify-content:center;
          transition:left 0.52s cubic-bezier(0.34,1.45,0.64,1),background 0.45s,box-shadow 0.45s;
          z-index:2;
          left:7px;
          background:linear-gradient(135deg,#e05555 0%,#8B2020 100%);
          box-shadow:0 0 16px rgba(224,85,85,0.55),0 0 32px rgba(224,85,85,0.2),0 4px 14px rgba(0,0,0,0.5);
        }
        .ba-track.is-after .ba-thumb {
          left:calc(248px - 54px - 7px);
          background:linear-gradient(135deg,var(--color-primary-light,#b7f3fb) 0%,var(--color-primary,#78e8f8) 100%);
          box-shadow:0 0 20px rgba(120,232,248,0.65),0 0 40px rgba(120,232,248,0.25),0 4px 14px rgba(0,0,0,0.4);
        }

        /* subtitle */
        .ba-subtitle {
          font-family:var(--font-family-title,'Palatino Linotype',serif);
          font-size:0.72rem; font-style:italic;
          color:var(--color-text-secondary,#a0a0a0); text-align:center;
          letter-spacing:0.04em; transition:color 0.45s;
        }
        .ba-subtitle.is-after { color:var(--color-primary); }

        /* card reveal */
        .ba-card-outer {
          width:100%; border-radius:18px; overflow:hidden;
          max-height:0; opacity:0;
          transition:max-height 0.55s cubic-bezier(0.4,0,0.2,1),opacity 0.4s ease;
          margin-bottom:0;
        }
        .ba-card-outer.visible { max-height:500px; opacity:1; margin-bottom:24px; }

        .ba-slider {
          display:flex; width:200%;
          transition:transform 0.55s cubic-bezier(0.77,0,0.175,1);
        }
        .ba-slider.slid { transform:translateX(-50%); }

        /* state blocks */
        .ba-block { width:50%; flex-shrink:0; padding:30px 26px 28px; }
        .ba-block-before {
          background:rgba(0,0,0,0.95);
          border:1px solid rgba(224,85,85,0.2); border-radius:18px;
        }
        .ba-block-after {
          background:rgba(0,0,0,0.95);
          border:1px solid rgba(120,232,248,0.18); border-radius:18px;
        }

        .ba-state-label {
          font-family:var(--font-family-title,'Palatino Linotype',serif);
          font-size:0.62rem; font-style:italic;
          letter-spacing:0.2em; text-transform:lowercase;
          margin-bottom:22px; opacity:0.8;
        }
        .ba-block-before .ba-state-label { color:#e05555; }
        .ba-block-after  .ba-state-label { color:var(--color-primary); }

        .ba-items-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

        .ba-item {
          display:flex; align-items:center; gap:11px; padding:13px 14px; border-radius:12px;
        }
        .ba-block-before .ba-item { background:rgba(224,85,85,0.07); }
        .ba-block-after  .ba-item { background:rgba(120,232,248,0.07); }

        .ba-item-icon {
          width:34px; height:34px; border-radius:9px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .ba-block-before .ba-item-icon { background:rgba(224,85,85,0.12); color:#e05555; }
        .ba-block-after  .ba-item-icon { background:rgba(120,232,248,0.1); color:var(--color-primary); }

        .ba-item-text {
          font-family:var(--font-family-title,'Palatino Linotype',serif);
          font-size:0.78rem; font-style:italic; line-height:1.35;
        }
        .ba-block-before .ba-item-text { color:#8a6060; }
        .ba-block-after  .ba-item-text { color:var(--color-primary-dark,#84c0c8); }

        /* bottom note */
        .ba-note {
          text-align:center;
          font-family:var(--font-family-body,'Roboto',sans-serif);
          font-size:0.68rem;
          color:var(--color-text-secondary,#a0a0a0); line-height:1.8; letter-spacing:0.02em;
          opacity:0; transition:opacity 0.4s ease 0.3s;
        }
        .ba-note.visible { opacity:1; }
        .ba-note span { color:var(--color-primary); }

        @media (max-width:860px){ .ba-section { padding:60px 20px 80px; } }
      `}</style>

      <section id="before-after" className="ba-section">
        <div className="ba-inner">
          <div className="ba-eyebrow">Tu punto de partida</div>
          <h2 className="ba-title">
            ¿Desde qué estado<br/>estás <span>operando hoy?</span>
          </h2>

          {/* toggle */}
          <div className="ba-toggle-wrapper">
            <div
              ref={trackRef}
              className={`ba-track${isAfter ? ' is-after' : ''}`}
              onClick={handleToggle}
            >
              <span className="ba-track-label ba-track-label-before">antes</span>
              <span className="ba-track-label ba-track-label-after">después</span>
              <div className="ba-thumb"><IconToggleWave /></div>
            </div>
            <p className={`ba-subtitle${isAfter ? ' is-after' : ''}`}>{subLabel}</p>
          </div>

          {/* sliding cards */}
          <div className={`ba-card-outer${isVisible ? ' visible' : ''}`}>
            <div className={`ba-slider${isAfter ? ' slid' : ''}`}>

              <div className="ba-block ba-block-before">
                <div className="ba-state-label">sin regulación</div>
                <div className="ba-items-grid">
                  {beforeItems.map(({ text, Icon }) => (
                    <div className="ba-item" key={text}>
                      <div className="ba-item-icon"><Icon /></div>
                      <span className="ba-item-text">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ba-block ba-block-after">
                <div className="ba-state-label">con Oaureal</div>
                <div className="ba-items-grid">
                  {afterItems.map(({ text, Icon }) => (
                    <div className="ba-item" key={text}>
                      <div className="ba-item-icon"><Icon /></div>
                      <span className="ba-item-text">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <p className={`ba-note${isAfter ? ' visible' : ''}`}>
            Con <span>regulación activa</span> y protocolo personalizado.
          </p>
        </div>
      </section>
    </>
  );
}
