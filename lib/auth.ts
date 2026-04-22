import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

function getAdminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const allowlist = getAdminAllowlist();
  if (allowlist.length > 0) {
    const email = user.email?.toLowerCase() ?? '';
    if (!email || !allowlist.includes(email)) {
      await supabase.auth.signOut();
      redirect('/admin/login?error=unauthorized');
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[auth] ADMIN_EMAILS is not configured. Any authenticated Supabase user can access the admin panel.'
    );
  }

  return { user, supabase };
}
