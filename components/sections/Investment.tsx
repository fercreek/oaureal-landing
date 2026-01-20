'use client';

import { Code, CreditCard, Truck } from 'lucide-react';
import { INVESTMENT_ITEMS } from '@/lib/constants';

const icons = [<Code size={24} key="code" />, <CreditCard size={24} key="card" />, <Truck size={24} key="truck" />];

export default function Investment() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif italic mb-4">Inversión del Proyecto</h2>
          <p className="text-[#a5f0fa] tracking-widest text-xs uppercase">Cotización estimada para MVP Funcional</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INVESTMENT_ITEMS.map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#a5f0fa]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#a5f0fa]/10 flex items-center justify-center text-[#a5f0fa] mb-6 group-hover:scale-110 transition-transform">
                {icons[idx]}
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">{item.title}</h4>
              <div className="text-2xl font-bold text-[#a5f0fa] mb-4">{item.price} <span className="text-xs text-gray-500">MXN</span></div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#011797]/10 to-[#54008c]/10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Inversión Total Estimada</p>
            <h3 className="text-3xl font-bold text-white">$23,000 — $27,000 <span className="text-sm font-light text-gray-400">MXN</span></h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#a5f0fa] italic">PoC lista para escalar a producción.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
