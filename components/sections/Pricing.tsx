'use client';

import { Zap, CheckCircle } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/constants';

export default function Pricing() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-serif mb-4">Elige tu plan de entrenamiento</h2>
        <div className="flex items-center justify-center gap-2 text-[#a5f0fa]">
          <Zap size={16} />
          <span className="text-sm font-bold uppercase tracking-widest">Oferta por tiempo limitado: 09:59</span>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan, i) => (
          <div key={i} className={`p-1 rounded-[32px] ${i === 1 ? 'bg-gradient-to-b from-[#a5f0fa] to-[#011797]' : 'bg-white/10'}`}>
            <div className="bg-black h-full rounded-[30px] p-8 flex flex-col items-center">
              {plan.promo && <span className="bg-[#a5f0fa] text-black text-[10px] font-bold px-3 py-1 rounded-full mb-4">{plan.promo}</span>}
              <p className="text-gray-500 text-xs tracking-widest mb-2">{plan.time}</p>
              <h4 className="text-2xl font-serif mb-4">{plan.name}</h4>
              <div className="text-5xl font-bold mb-6">{plan.price} <span className="text-sm text-gray-500">MXN</span></div>
              <ul className="text-sm text-gray-400 space-y-4 mb-10 text-left w-full">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#a5f0fa]" /> Acceso a todos los audios</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#a5f0fa]" /> Protocolo PDF incluido</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#a5f0fa]" /> Formato WAV sin compresión</li>
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition-all ${i === 1 ? 'bg-[#a5f0fa] text-black shadow-[0_0_20px_#a5f0fa]' : 'border border-white/20 text-white hover:bg-white/5'}`}>
                CONSEGUIR MI PLAN
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
