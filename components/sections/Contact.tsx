'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, Send } from 'lucide-react';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';

const CONTACT_EMAIL = 'oaurealoficial@gmail.com';

const inputClass =
  'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-text font-body text-sm placeholder:text-text-secondary focus:outline-none focus:border-primary/60 focus:shadow-[0_0_15px_rgba(120,232,248,0.15)] transition-all';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const subject = encodeURIComponent(`Pregunta desde la web — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    // Abre la app de correo del visitante con todo prellenado.
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, el correo sigue visible para copiarlo a mano.
    }
  };

  return (
    <Section id="contacto" background="secondary" maxWidth="sm">
      <SectionTitle
        title="¿Tienes alguna pregunta?"
        subtitle="Escríbenos y te responderemos lo antes posible."
        size="md"
        palatino
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-bg/60 p-6 md:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-subtitle tracking-widest text-text-muted mb-2">
              NOMBRE
            </label>
            <input id="contact-name" name="name" type="text" required maxLength={100} placeholder="Tu nombre" className={inputClass} />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-subtitle tracking-widest text-text-muted mb-2">
              MENSAJE
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              maxLength={2000}
              placeholder="¿En qué podemos ayudarte?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-bg font-subtitle font-bold shadow-[0_0_30px_var(--color-primary)] hover:scale-[1.02] transition-all"
          >
            ENVIAR MENSAJE
            <Send className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-text-secondary font-body">
            Se abrirá tu aplicación de correo con el mensaje listo para enviar.
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-body">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copiar correo"
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-white/10 text-xs text-text-muted hover:text-primary hover:border-primary/40 transition-all"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </motion.div>
    </Section>
  );
}
