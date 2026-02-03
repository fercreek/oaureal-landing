import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import LeadsTable from '@/components/admin/LeadsTable';
import Pagination from '@/components/admin/Pagination';

const LEADS_PER_PAGE = 20;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAuth();
  const params = searchParams ? await searchParams : {};
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const skip = (page - 1) * LEADS_PER_PAGE;

  const [leads, totalLeads] = await Promise.all([
    prisma.quizSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: LEADS_PER_PAGE,
    }),
    prisma.quizSubmission.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalLeads / LEADS_PER_PAGE));

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
        {totalLeads > 0 && (
          <Pagination
            basePath="/admin/leads"
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalLeads}
            limit={LEADS_PER_PAGE}
          />
        )}
      </div>
    </div>
  );
}
