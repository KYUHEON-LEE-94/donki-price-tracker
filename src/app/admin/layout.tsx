
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ❗ 관리자는 특정 이메일만 허용
  const allowedEmails = ['admin@donki.com'];

  if (!user || !allowedEmails.includes(user.email ?? '')) {
    redirect('/admin-login');
  }

  return <>{children}</>;
}