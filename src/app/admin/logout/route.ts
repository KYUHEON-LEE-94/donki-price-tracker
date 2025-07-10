// src/app/admin/logout/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });

  await supabase.auth.signOut(); // 세션 삭제

  return NextResponse.redirect(new URL('/admin-login', process.env.NEXT_PUBLIC_SITE_URL));
}
