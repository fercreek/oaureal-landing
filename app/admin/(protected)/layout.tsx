import { requireAuth } from '@/lib/auth';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <>
      <AdminNavbar />
      <div className="pt-20">
        {children}
      </div>
    </>
  );
}
