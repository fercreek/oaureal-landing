import AdminNavbar from '@/components/admin/AdminNavbar';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar showLogout={false} />
      <div className="pt-20">
        {children}
      </div>
    </>
  );
}
