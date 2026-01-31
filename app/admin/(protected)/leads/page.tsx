import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import LeadsTable from '@/components/admin/LeadsTable';

export default async function LeadsPage() {
  await requireAuth();

  const leads = await prisma.quizSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-title mb-2 text-primary">Leads</h1>
          <p className="text-text-muted font-body">
            Correos y resultados del quiz. Email, arquetipo y respuestas por pregunta.
          </p>
        </div>

        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
