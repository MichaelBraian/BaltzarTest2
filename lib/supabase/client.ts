import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'

// Explicitly pass env vars for debugging Netlify environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_URL is not defined!");
  // Optionally throw an error or return a dummy client to prevent hard crash
}
if (!supabaseAnonKey) {
  console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined!");
}

console.log("[Supabase Client Init] URL:", supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'UNDEFINED'); // Log part of URL

export const createClient = () => {
  // Ensure vars are passed, even if helper should auto-detect
  return createClientComponentClient<Database>({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
} 