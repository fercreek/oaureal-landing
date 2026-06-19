import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre Oaureal: Tu Sistema Nervioso es Entrenable",
  description:
    "OA = Onda Aureal. REAL = resultados verificables. Conoce la ciencia y la filosofía detrás de Oaureal y sus protocolos de audio binaural para regular el sistema nervioso.",
  alternates: {
    canonical: "https://oaureal.com/sobre-oaureal",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://oaureal.com/sobre-oaureal",
  url: "https://oaureal.com/sobre-oaureal",
  name: "Sobre Oaureal: Tu Sistema Nervioso es Entrenable",
  description:
    "OA = Onda Aureal. REAL = resultados verificables. Conoce la ciencia y la filosofía detrás de Oaureal y sus protocolos de audio binaural.",
  inLanguage: "es-MX",
  publisher: {
    "@id": "https://oaureal.com/#organization",
  },
};

export default function SobreOaurealPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-6 py-24 pt-36">

        <p className="text-xs font-subtitle font-bold tracking-widest text-primary mb-5">OAUREAL</p>

        <h1 className="text-5xl md:text-7xl font-palatino leading-tight mb-8 text-white">
          Tu sistema nervioso es entrenable.
        </h1>

        <div className="w-16 h-px bg-primary mb-12" />

        <p className="text-lg md:text-xl font-palatino text-white/70 mb-5 leading-relaxed">
          Regulación funcional: la capacidad de entrar y salir de estados mentales de forma estratégica. Porque rendir mejor no es exigirte más. Es regular mejor.
        </p>

        <p className="text-base font-body text-text-muted mb-4 leading-relaxed">
          La mayoría de las personas con fatiga mental, dificultad para dormir o incapacidad de concentrarse no tienen un problema de falta de ganas o debilidad. Tienen un sistema nervioso autónomo sobreestimulado que olvidó cómo volver al balance.
        </p>

        <p className="text-base font-body text-text-muted mb-16 leading-relaxed">
          En Oaureal combinamos técnicas y herramientas para modular tu respuesta al estrés y recuperar el control de tu energía desde la raíz.
        </p>

        <div className="w-16 h-px bg-primary/20 mb-16" />

        {/* El problema */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-palatino text-primary mb-8">
            El problema que resuelve
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <p className="text-red-400 font-subtitle font-bold text-xs tracking-widest mb-4">SIN OAUREAL</p>
              <ul className="space-y-3">
                {[
                  "Sistema nervioso en hipervigilancia constante.",
                  "Relajación confundida con descanso pasivo.",
                  "Rendimiento basado en el agotamiento cognitivo.",
                ].map((item, i) => (
                  <li key={i} className="text-sm text-text-muted leading-relaxed border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-primary/25 bg-primary/5">
              <p className="text-primary font-subtitle font-bold text-xs tracking-widest mb-4">CON OAUREAL</p>
              <ul className="space-y-3">
                {[
                  "Diagnóstico preciso de tu arquetipo de estrés.",
                  "Protocolos de audio adaptados a tu perfil de regulación.",
                  "Transiciones eficientes entre enfoque y recuperación.",
                ].map((item, i) => (
                  <li key={i} className="text-sm text-text-muted leading-relaxed border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="w-16 h-px bg-primary/20 mb-16" />

        {/* Las 3 Vías */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-palatino text-primary mb-4">
            Las 3 Vías de Regulación
          </h2>
          <p className="text-base font-body text-text-muted mb-8 leading-relaxed">
            Diseñamos herramientas para modular tu sistema en tres momentos clave del día.
          </p>

          <div className="space-y-3">
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-primary/12">
              <p className="text-primary font-subtitle font-bold tracking-widest text-xs mb-2">01 / ENFOQUE</p>
              <h3 className="text-xl font-palatino text-white mb-3">Activación Controlada</h3>
              <p className="text-base font-body text-text-muted leading-relaxed">
                Optimización para el trabajo profundo, la claridad mental y la toma de decisiones sin la taquicardia o la ansiedad del exceso de estimulantes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] border border-primary/35">
              <p className="text-primary font-subtitle font-bold tracking-widest text-xs mb-2">02 / BALANCE</p>
              <h3 className="text-xl font-palatino text-white mb-3">Regulación Central</h3>
              <p className="text-base font-body text-text-muted leading-relaxed">
                El punto óptimo de rendimiento sin esfuerzo visible. Ni sobreactivado ni apagado. Donde el cerebro opera con{" "}
                <span className="text-primary">máxima eficiencia</span>.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] border border-primary/12">
              <p className="text-primary font-subtitle font-bold tracking-widest text-xs mb-2">03 / RECUPERACIÓN</p>
              <h3 className="text-xl font-palatino text-white mb-3">Descenso Activo</h3>
              <p className="text-base font-body text-text-muted leading-relaxed">
                Apagar el monólogo mental y mitigar el cortisol por la noche. No es solo dormir; es darle al sistema el sustrato biológico necesario para una{" "}
                <span className="text-primary">restauración cognitiva real</span>.
              </p>
            </div>
          </div>
        </section>

        <div className="w-16 h-px bg-primary/20 mb-16" />

        {/* Para quién */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-palatino text-primary mb-6">
            Para quién es Oaureal
          </h2>
          <p className="text-base font-body text-text-muted leading-relaxed mb-4">
            Para personas que viven de su mente: fundadores, profesionales de alto rendimiento, creativos y atletas cognitivos.
          </p>
          <p className="text-base font-body text-text-muted leading-relaxed">
            Oaureal no es un espacio de bienestar común. Es para quien ya sabe que sus límites son fisiológicos y busca herramientas de precisión científica para intervenirlos.
          </p>
        </section>

        {/* CTA */}
        <div className="rounded-3xl border border-primary/20 bg-primary/[0.03] p-10 text-center">
          <p className="text-xs font-subtitle font-bold tracking-widest text-primary mb-4">EMPIEZA CON EL DIAGNÓSTICO</p>
          <h3 className="text-2xl md:text-3xl font-palatino text-white mb-3">
            El test identifica tu estado actual en 3 minutos.
          </h3>
          <p className="text-text-muted font-body mb-8">
            Recomienda el protocolo correcto para tu perfil.
          </p>
          <Link
            href="/#quiz"
            className="inline-block px-10 py-4 bg-primary text-bg font-subtitle font-bold rounded-full hover:scale-105 transition-all"
          >
            Iniciar diagnóstico →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
