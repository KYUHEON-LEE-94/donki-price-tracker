// src/app/services/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ 일반 클라이언트 (주로 Storage 등 백엔드 용도)
export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ 컴포넌트용 클라이언트 (로그인/세션 관리용)
export const supabaseClient = createClientComponentClient<Database>();
