import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowedEmails = ['admin@donki.com'];
  if (!user || !allowedEmails.includes(user.email ?? '')) {
    redirect('/admin-login');
  }

  const email = user.email ?? 'unknown';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">👨‍💼 관리자</h1>
          <nav className="space-y-3">
            <Link href="/admin/certifications" className="block hover:underline">📮 인증 요청</Link>
            <Link href="/admin/stores" className="block hover:underline">🏬 지점 관리</Link>
            <Link href="/admin/reports" className="block hover:underline">🏆 최저가 관리</Link>
          </nav>
        </div>

        {/* 로그인 정보 표시 */}
        <div className="text-sm text-gray-300 border-t border-gray-700 pt-4">
          ✅ 로그인됨:  
          <div className="font-semibold text-white">{email}</div>

          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="text-xs text-red-400 hover:text-red-200 mt-2"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
