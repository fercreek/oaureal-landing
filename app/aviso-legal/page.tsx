import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata = {
  title: 'Aviso legal',
  description:
    'Aviso legal de Oaureal. Los contenidos están diseñados como herramientas de bienestar y entrenamiento mental. No sustituyen terapia, medicación ni tratamiento profesional.',
};

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-bg text-text font-body">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24 pt-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-10 font-subtitle"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl md:text-5xl font-palatino text-primary mb-10">Aviso legal</h1>

        <div className="space-y-6 text-text-muted leading-relaxed">
          <p>
            Los contenidos de Oaureal están diseñados como herramientas de bienestar,
            autorregulación y entrenamiento mental consciente.
          </p>
          <p>
            Los audios de Oaureal no curan condiciones médicas ni psicológicas, ni sustituyen
            terapia, medicación o tratamiento profesional. Su función es brindar espacios sonoros
            de calma, enfoque o descanso, desde los cuales el sistema nervioso puede empezar a
            entrenarse de forma progresiva en nuevos patrones de regulación. No trabajan sobre
            causas orgánicas o clínicas, sino sobre el estado funcional desde el que operas en tu
            día a día.
          </p>

          <p className="font-subtitle font-semibold text-text mt-8">
            No se recomienda su uso en personas con:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Epilepsia o antecedentes de convulsiones</li>
            <li>Trastornos neurológicos sensibles a estímulos auditivos</li>
            <li>
              Implantes auditivos o neurológicos, salvo indicación y supervisión médica
            </li>
          </ul>

          <p>
            Si tienes una condición neurológica diagnosticada, estás bajo tratamiento psiquiátrico,
            utilizas medicación o tienes dudas sobre su uso, consulta previamente con un
            profesional de la salud.
          </p>
          <p>
            Oaureal no sustituye atención médica ni psicológica. Es una herramienta complementaria,
            orientada al entrenamiento consciente del estado mental.
          </p>
          <p>Los resultados pueden variar entre personas según su contexto y constancia de uso.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
