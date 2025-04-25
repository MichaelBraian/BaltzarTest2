import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/types/supabase'

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
} 