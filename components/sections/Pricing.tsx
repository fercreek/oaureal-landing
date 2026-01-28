'use client';

import { Zap, CheckCircle } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/constants';
import ReviewBadge from '@/components/ui/ReviewBadge';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import Grid from '@/components/ui/Grid';

export default function Pricing() {
  return (
    <Section className="relative">
      <ReviewBadge note="Precios y planes pendientes de aprobación final" />
      <div className="text-center mb-16">
        <h2 className="text-4xl font-title mb-4 text-primary">Elige tu plan de entrenamiento</h2>
        <div className="flex items-center justify-center gap-2 text-primary">
          <Zap size={16} />
          <span className="text-sm font-subtitle font-bold uppercase tracking-widest">Oferta por tiempo limitado: 09:59</span>
        </div>
      </div>
      
      <Grid cols={{ base: 1, md: 3 }} gap="lg" animate={false}>
        {PRICING_PLANS.map((plan, i) => (
          <div key={i} className={`p-1 rounded-[32px] ${i === 1 ? 'bg-gradient-to-b from-primary to-primary-dark' : 'bg-white/10'}`}>
            <div className="bg-bg h-full rounded-[30px] p-8 flex flex-col items-center">
              {plan.promo && <span className="bg-primary text-bg text-[10px] font-subtitle font-bold px-3 py-1 rounded-full mb-4">{plan.promo}</span>}
              <p className="text-text-secondary text-xs font-subtitle tracking-widest mb-2">{plan.time}</p>
              <h4 className="text-2xl font-title mb-4 text-text">{plan.name}</h4>
              <div className="text-5xl font-bold mb-6 text-text">{plan.price} <span className="text-sm text-text-secondary">MXN</span></div>
              <ul className="text-sm text-text-muted space-y-4 mb-10 text-left w-full font-body">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" /> Acceso a todos los audios</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" /> Protocolo PDF incluido</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" /> Formato WAV sin compresión</li>
              </ul>
              <button className={`w-full py-4 rounded-xl font-subtitle font-bold transition-all ${i === 1 ? 'bg-primary text-bg shadow-[0_0_20px_var(--color-primary)]' : 'border border-white/20 text-text hover:bg-white/5'}`}>
                CONSEGUIR MI PLAN
              </button>
            </div>
          </div>
          ))}
      </Grid>
    </Section>
  );
}
