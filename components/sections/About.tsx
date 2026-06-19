'use client';

import { useEffect, useRef } from 'react';

/* ─── tipos internos ─────────────────────────────────── */
interface BrainNode {
  bx: number; by: number;
  ox: number; oy: number;
  ph: number; sp: number; amp: number;
  sz: number; act: boolean;
}

/* ══════════════════════════════════════════════════════
   BRAIN CANVAS (card 1)
══════════════════════════════════════════════════════ */
function useBrainCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const canvas = canvasEl;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0, nodes: BrainNode[] = [], t = 0, st = 0, si = 0, raf: number;
    const STATES = [
      { name: 'ALFA',  freq: '10.2 Hz' },
      { name: 'THETA', freq: '6.5 Hz'  },
      { name: 'BETA',  freq: '18.4 Hz' },
      { name: 'GAMMA', freq: '42.1 Hz' },
    ];
    const stEl = canvas.parentElement?.querySelector<HTMLElement>('[data-state]');
    const frEl = canvas.parentElement?.querySelector<HTMLElement>('[data-freq]');

    function build() {
      nodes = [];
      for (let i = 0; i < 70; i++) {
        const a = (i / 70) * Math.PI * 2;
        const rx = 0.33 + 0.05 * Math.cos(a * 3) + 0.02 * Math.cos(a * 7);
        const ry = 0.27 + 0.04 * Math.sin(a * 2) + 0.015 * Math.sin(a * 5);
        nodes.push({ bx: (0.5 + rx * Math.cos(a)) * W, by: (0.5 + ry * Math.sin(a)) * H, ox: 0, oy: 0, ph: Math.random() * Math.PI * 2, sp: 0.3 + Math.random() * 0.5, amp: 1 + Math.random() * 2, sz: 1.2 + Math.random() * 1.8, act: Math.random() > 0.55 });
      }
      for (let i = 0; i < 35; i++) {
        const a = Math.random() * Math.PI * 2, r = Math.random() * 0.22;
        nodes.push({ bx: (0.5 + r * Math.cos(a)) * W, by: (0.5 + r * Math.sin(a)) * H, ox: 0, oy: 0, ph: Math.random() * Math.PI * 2, sp: 0.2 + Math.random() * 0.4, amp: 0.8 + Math.random() * 1.5, sz: 1 + Math.random() * 1.2, act: Math.random() > 0.4 });
      }
    }
    function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect();
      W = canvas.width = rect.width; H = canvas.height = rect.height; build();
    }
    function draw() {
      t += 0.012; st += 0.012;
      if (st > 380) {
        st = 0; si = (si + 1) % STATES.length;
        if (stEl) stEl.textContent = STATES[si].name;
        if (frEl) frEl.textContent = STATES[si].freq;
      }
      ctx.clearRect(0, 0, W, H);
      // use CSS var color at runtime
      const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#78e8f8';
      const ca = (a: number) => {
        // convert hex to rgba
        const r = parseInt(primary.slice(1,3),16), g = parseInt(primary.slice(3,5),16), b = parseInt(primary.slice(5,7),16);
        return `rgba(${r},${g},${b},${a})`;
      };
      const grd = ctx.createRadialGradient(W/2,H/2,20,W/2,H/2,Math.min(W,H)*0.5);
      grd.addColorStop(0, ca(0.04)); grd.addColorStop(1,'transparent');
      ctx.fillStyle = grd; ctx.fillRect(0,0,W,H);
      for (const n of nodes) { n.ox = n.bx + Math.sin(t*n.sp+n.ph)*n.amp; n.oy = n.by + Math.cos(t*n.sp*0.7+n.ph)*n.amp; }
      for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
        const a=nodes[i],b=nodes[j],dx=a.ox-b.ox,dy=a.oy-b.oy,d=Math.sqrt(dx*dx+dy*dy);
        if (d<50) { const p=(Math.sin(t*2.2+i*0.3)+1)*0.5,al=(1-d/50)*0.1*(a.act&&b.act?1+p*0.8:0.25); ctx.beginPath(); ctx.moveTo(a.ox,a.oy); ctx.lineTo(b.ox,b.oy); ctx.strokeStyle=ca(al); ctx.lineWidth=0.5; ctx.stroke(); }
      }
      for (const n of nodes) { const p=(Math.sin(t*n.sp*2+n.ph)+1)*0.5; ctx.beginPath(); ctx.arc(n.ox,n.oy,n.sz*(n.act?1+p*0.3:1),0,Math.PI*2); ctx.fillStyle=ca(n.act?0.45+p*0.5:0.12); ctx.fill(); }
      ctx.beginPath();
      const ol=nodes.slice(0,70); ctx.moveTo(ol[0].ox,ol[0].oy);
      for (let i=1;i<ol.length;i++){const pv=ol[i-1],cv=ol[i];ctx.quadraticCurveTo(pv.ox,pv.oy,(pv.ox+cv.ox)/2,(pv.oy+cv.oy)/2);}
      ctx.closePath(); ctx.strokeStyle=ca(0.18); ctx.lineWidth=1; ctx.stroke();
      raf = requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize(); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [ref]);
}

/* ══════════════════════════════════════════════════════
   WAVE CANVAS (card 2)
══════════════════════════════════════════════════════ */
function useWaveCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const canvas = canvasEl;
    const ctx = canvas.getContext('2d')!;
    let W=0,H=0,t=0,raf:number;
    function resize(){const r=canvas.parentElement!.getBoundingClientRect();W=canvas.width=r.width;H=canvas.height=r.height;}
    function wave(freq:number,amp:number,phase:number,color:string,fill:string,yOff:number){
      ctx.beginPath();ctx.moveTo(0,H);
      for(let x=0;x<=W;x++){const y=yOff+Math.sin((x/W)*Math.PI*2*freq+t+phase)*amp;ctx.lineTo(x,y);}
      ctx.lineTo(W,H);ctx.closePath();
      const grd=ctx.createLinearGradient(0,0,0,H);grd.addColorStop(0,fill);grd.addColorStop(1,'transparent');
      ctx.fillStyle=grd;ctx.fill();
      ctx.beginPath();
      for(let x=0;x<=W;x++){const y=yOff+Math.sin((x/W)*Math.PI*2*freq+t+phase)*amp;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.shadowBlur=7;ctx.shadowColor=color;ctx.stroke();ctx.shadowBlur=0;
    }
    function draw(){
      t+=0.045;ctx.clearRect(0,0,W,H);
      wave(3,H*0.13,0,'rgba(120,232,248,0.75)','rgba(120,232,248,0.12)',H*0.35);
      wave(3.9,H*0.13,1.3,'rgba(160,32,240,0.65)','rgba(160,32,240,0.08)',H*0.55);
      wave(1,H*0.10,0.5,'rgba(120,232,248,0.45)','rgba(120,232,248,0.05)',H*0.72);
      raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(resize);ro.observe(canvas.parentElement!);resize();draw();
    return ()=>{cancelAnimationFrame(raf);ro.disconnect();};
  },[ref]);
}

/* ══════════════════════════════════════════════════════
   FLOW CANVAS (card 3)
══════════════════════════════════════════════════════ */
function useFlowCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const canvas = canvasEl;
    const ctx = canvas.getContext('2d')!;
    let W=0,H=0,t=0,raf:number;
    const steps=[{label:'RECONOCER',x:0.18},{label:'ENTENDER',x:0.50},{label:'ACTIVAR',x:0.82}];
    function resize(){const r=canvas.parentElement!.getBoundingClientRect();W=canvas.width=r.width;H=canvas.height=r.height;}
    function draw(){
      t+=0.016;ctx.clearRect(0,0,W,H);
      const primary=getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()||'#78e8f8';
      const r=parseInt(primary.slice(1,3),16),g=parseInt(primary.slice(3,5),16),b=parseInt(primary.slice(5,7),16);
      const cp=(a:number)=>`rgba(${r},${g},${b},${a})`;
      const cy=H*0.5;
      ctx.beginPath();ctx.moveTo(W*0.1,cy);ctx.lineTo(W*0.9,cy);ctx.strokeStyle=cp(0.15);ctx.lineWidth=1;ctx.stroke();
      const px=W*0.1+W*0.8*((Math.sin(t*0.7)+1)*0.5);
      const pGrd=ctx.createRadialGradient(px,cy,0,px,cy,30);pGrd.addColorStop(0,cp(0.5));pGrd.addColorStop(1,'transparent');
      ctx.fillStyle=pGrd;ctx.fillRect(px-30,cy-30,60,60);
      steps.forEach((s,i)=>{
        const x=W*s.x,pulse=(Math.sin(t*1.2+i*1.1)+1)*0.5;
        ctx.beginPath();ctx.arc(x,cy,10+pulse*3,0,Math.PI*2);ctx.strokeStyle=cp(0.12+pulse*0.15);ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.arc(x,cy,5,0,Math.PI*2);ctx.fillStyle=cp(0.6+pulse*0.4);ctx.fill();
        ctx.font="600 8px 'Exo 2',sans-serif";ctx.fillStyle=cp(0.55+pulse*0.3);ctx.textAlign='center';ctx.fillText(s.label,x,cy+26);
      });
      raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(resize);ro.observe(canvas.parentElement!);resize();draw();
    return ()=>{cancelAnimationFrame(raf);ro.disconnect();};
  },[ref]);
}

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════ */
function AnimCard({ children, delay=0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity='1'; el.style.transform='translateY(0)'; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="about-card" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CANVAS WRAPPERS
══════════════════════════════════════════════════════ */
function BrainVisual() {
  const ref = useRef<HTMLCanvasElement>(null);
  useBrainCanvas(ref);
  return (
    <div className="about-card-visual">
      <div className="about-corner about-corner-tl"/><div className="about-corner about-corner-tr"/>
      <div className="about-corner about-corner-bl"/><div className="about-corner about-corner-br"/>
      <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>
      <div className="about-vis-label">Estado · <span data-state>ALFA</span></div>
      <div className="about-vis-val" data-freq>10.2 Hz</div>
    </div>
  );
}
function WaveVisual() {
  const ref = useRef<HTMLCanvasElement>(null);
  useWaveCanvas(ref);
  return (
    <div className="about-card-visual about-card-visual--secondary">
      <div className="about-corner about-corner-tl"/><div className="about-corner about-corner-tr"/>
      <div className="about-corner about-corner-bl"/><div className="about-corner about-corner-br"/>
      <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>
      <div className="about-vis-label about-vis-label--secondary">Oído izq · Oído der · Binaural</div>
    </div>
  );
}
function FlowVisual() {
  const ref = useRef<HTMLCanvasElement>(null);
  useFlowCanvas(ref);
  return (
    <div className="about-card-visual">
      <div className="about-corner about-corner-tl"/><div className="about-corner about-corner-tr"/>
      <div className="about-corner about-corner-bl"/><div className="about-corner about-corner-br"/>
      <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>
      <div className="about-vis-label">Protocolo activo</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function About() {
  return (
    <>
      <style>{`
        /* wrapper */
        .about-section {
          position:relative; z-index:1;
          width:100%; max-width:1280px;
          margin:0 auto; padding:90px 40px 70px;
        }
        .about-header { text-align:center; margin-bottom:56px; }

        /* eyebrow — usa font-subtitle (Exo 2) y color-primary como el resto de la web */
        .about-eyebrow {
          font-family:var(--font-family-subtitle,'Exo 2',sans-serif);
          font-size:10px; font-weight:600; letter-spacing:4px;
          color:var(--color-primary); text-transform:uppercase;
          margin-bottom:16px;
          display:flex; align-items:center; justify-content:center; gap:14px;
        }
        .about-eyebrow::before,.about-eyebrow::after {
          content:''; width:36px; height:1px;
          background:linear-gradient(90deg,transparent,var(--color-primary));
        }
        .about-eyebrow::after { transform:scaleX(-1); }

        /* title — font-title (Palatino) igual que SectionTitle */
        .about-title {
          font-family:var(--font-family-title,'Palatino Linotype',serif);
          font-size:clamp(28px,4vw,50px); font-weight:400; font-style:italic;
          color:var(--color-text); line-height:1.1; letter-spacing:0.01em;
        }
        .about-title em { font-style:normal; color:var(--color-primary); }

        /* 3-col grid */
        .about-cols {
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:1px; background:rgba(120,232,248,0.06);
        }

        /* card — bg negro, borde primary igual al resto */
        .about-card {
          background:var(--color-bg);
          padding:40px 32px 44px;
          position:relative; overflow:hidden;
          opacity:0; transform:translateY(20px);
          transition:opacity 0.65s,transform 0.65s;
        }

        /* top accent: primary en card 1 y 3, secondary en card 2 */
        .about-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
        }
        .about-card:nth-child(1)::before { background:linear-gradient(90deg,transparent,var(--color-primary),transparent); }
        .about-card:nth-child(2)::before { background:linear-gradient(90deg,transparent,var(--color-secondary,#a020f0),transparent); }
        .about-card:nth-child(3)::before { background:linear-gradient(90deg,transparent,var(--color-primary),transparent); }

        /* bottom hover */
        .about-card::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
          opacity:0; transition:opacity 0.35s;
        }
        .about-card:nth-child(1)::after { background:linear-gradient(90deg,transparent,var(--color-primary),transparent); }
        .about-card:nth-child(2)::after { background:linear-gradient(90deg,transparent,var(--color-secondary,#a020f0),transparent); }
        .about-card:nth-child(3)::after { background:linear-gradient(90deg,transparent,var(--color-primary),transparent); }
        .about-card:hover::after { opacity:1; }

        /* canvas area */
        .about-card-visual {
          height:120px; margin-bottom:28px;
          position:relative; border:0 solid var(--color-primary);
        }
        .about-card-visual--secondary { border-color:var(--color-secondary,#a020f0); }

        /* corner brackets */
        .about-corner {
          position:absolute; width:10px; height:10px;
          border-style:solid; border-color:inherit; opacity:0.3;
        }
        .about-corner-tl { top:0; left:0;  border-width:1px 0 0 1px; }
        .about-corner-tr { top:0; right:0; border-width:1px 1px 0 0; }
        .about-corner-bl { bottom:0; left:0;  border-width:0 0 1px 1px; }
        .about-corner-br { bottom:0; right:0; border-width:0 1px 1px 0; }

        .about-vis-label {
          position:absolute; bottom:6px; left:8px;
          font-family:var(--font-family-subtitle,'Exo 2',sans-serif);
          font-size:8px; letter-spacing:2px; text-transform:uppercase;
          opacity:0.6; color:var(--color-primary);
        }
        .about-vis-label--secondary { color:var(--color-secondary,#a020f0); }
        .about-vis-val {
          position:absolute; top:8px; right:10px;
          font-family:var(--font-family-subtitle,'Exo 2',sans-serif);
          font-size:11px; font-weight:700; letter-spacing:1px;
          color:var(--color-primary);
        }

        /* ghost number */
        .about-card-num {
          font-family:var(--font-family-subtitle,'Exo 2',sans-serif);
          font-size:54px; font-weight:700; line-height:1;
          color:rgba(120,232,248,0.04);
          position:absolute; bottom:12px; right:16px;
          user-select:none; pointer-events:none;
        }
        .about-card:nth-child(2) .about-card-num { color:rgba(160,32,240,0.05); }

        /* card text */
        .about-card-eyebrow {
          font-family:var(--font-family-subtitle,'Exo 2',sans-serif);
          font-size:9px; letter-spacing:3px; text-transform:uppercase;
          margin-bottom:10px; color:var(--color-primary);
        }
        .about-card:nth-child(2) .about-card-eyebrow { color:var(--color-secondary,#a020f0); }

        .about-card-title {
          font-family:var(--font-family-title,'Palatino Linotype',serif);
          font-size:clamp(17px,1.6vw,21px); font-weight:400; font-style:italic;
          color:var(--color-text); margin-bottom:16px; line-height:1.25;
        }
        .about-card-body {
          font-family:var(--font-family-body,'Roboto',sans-serif);
          font-size:13.5px; font-weight:400; line-height:1.78;
          color:var(--color-text-muted);
        }
        .about-card-body p { margin-bottom:10px; }
        .about-card-body p:last-child { margin-bottom:0; }
        .about-card-body em { font-style:italic; color:var(--color-primary); }
        .about-card:nth-child(2) .about-card-body em { color:var(--color-secondary,#a020f0); }

        .about-card-tag {
          display:inline-block; margin-top:18px; padding:5px 14px;
          border:1px solid rgba(120,232,248,0.28);
          background:rgba(120,232,248,0.07);
          font-family:var(--font-family-subtitle,'Exo 2',sans-serif);
          font-size:9px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
          color:var(--color-primary);
        }
        .about-card:nth-child(2) .about-card-tag {
          color:var(--color-secondary,#a020f0);
          border-color:rgba(160,32,240,0.3);
          background:rgba(160,32,240,0.07);
        }

        /* divider */
        .about-divider {
          position:relative; z-index:1; width:100%; height:1px;
          background:linear-gradient(90deg,transparent 0%,rgba(120,232,248,0.15) 30%,rgba(120,232,248,0.15) 70%,transparent 100%);
        }

        @media (max-width:860px){
          .about-cols { grid-template-columns:1fr; }
          .about-section { padding:60px 20px 50px; }
        }
      `}</style>

      <section id="about">
        <div className="about-section">
          <div className="about-header">
            <div className="about-eyebrow">Sistema Neuroacústico</div>
            <h2 className="about-title">qué es <em>Oaureal</em></h2>
          </div>

          <div className="about-cols">

            {/* Card 1 */}
            <AnimCard delay={0}>
              <BrainVisual />
              <div className="about-card-eyebrow">Sistema OAUREAL</div>
              <div className="about-card-title">Entrenamiento consciente<br/>de tu mente</div>
              <div className="about-card-body">
                <p>OAUREAL es un sistema de <em>regulación del sistema nervioso</em>.</p>
                <p>Combinamos neuroacústica y protocolos integrales para ayudarte a reconocer desde qué estado está operando tu mente — y acompañarte en su regulación.</p>
              </div>
              <div className="about-card-tag">No es música · No es meditación</div>
              <div className="about-card-num">01</div>
            </AnimCard>

            {/* Card 2 */}
            <AnimCard delay={140}>
              <WaveVisual />
              <div className="about-card-eyebrow">Qué son los Binaurales</div>
              <div className="about-card-title">Dos frecuencias.<br/>Una tercera interna.</div>
              <div className="about-card-body">
                <p>Dos frecuencias distintas — una en cada oído. Tu cerebro percibe la diferencia y genera una <em>tercera frecuencia internamente</em>.</p>
                <p>Eso acompaña al sistema nervioso hacia el estado que necesita — sin forzarlo.</p>
              </div>
              <div className="about-card-tag">WAV · Sin compresión · Señal limpia</div>
              <div className="about-card-num">02</div>
            </AnimCard>

            {/* Card 3 */}
            <AnimCard delay={280}>
              <FlowVisual />
              <div className="about-card-eyebrow">Por qué es Diferente</div>
              <div className="about-card-title">Primero entiendes.<br/>Luego recibes.</div>
              <div className="about-card-body">
                <p>La mayoría te dice qué hacer. OAUREAL empieza por <em>entender desde dónde estás operando</em>.</p>
                <p>Primero reconoces tu estado. Luego entiendes por qué. Después recibes las herramientas <em>específicas para ese momento</em>.</p>
              </div>
              <div className="about-card-tag">Reconocer · Entender · Activar</div>
              <div className="about-card-num">03</div>
            </AnimCard>

          </div>
        </div>

        <div className="about-divider"/>
      </section>
    </>
  );
}
