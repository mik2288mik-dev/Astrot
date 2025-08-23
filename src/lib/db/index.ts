import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

// Prisma Client Singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Supabase Client
// Allow using SUPABASE_URL as a fallback so production builds work even when
// only server-side env vars are configured. Throw a clear error if neither is
// provided.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

if (!supabaseUrl) {
  throw new Error(
    'Supabase URL is required. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.'
  )
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Публичный клиент для клиентской части
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Сервисный клиент для серверной части (с полными правами)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
