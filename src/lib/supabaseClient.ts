import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let cachedClient: ReturnType<typeof createClient<Database>> | null = null

function getUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
}

function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
}

export function getSupabaseClient() {
  if (!cachedClient) {
    const url = getUrl()
    const anon = getAnonKey()
    cachedClient = createClient<Database>(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return cachedClient
}

export const supabase = getSupabaseClient()

export type { Database } from './database.types'