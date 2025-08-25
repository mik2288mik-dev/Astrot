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

// Supabase Client - Lazy initialization to handle build-time missing env vars
let supabaseInstance: ReturnType<typeof createClient> | null = null
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  if (!url) {
    // Всегда возвращаем плейсхолдер на этапе сборки, чтобы не падать
    return 'https://placeholder.supabase.co'
  }
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    // Всегда возвращаем плейсхолдер на этапе сборки, чтобы не падать
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
  }
  return key
}

function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    // Всегда возвращаем плейсхолдер на этапе сборки, чтобы не падать
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
  }
  return key
}

// Публичный клиент для клиентской части
export const supabase = (() => {
  if (!supabaseInstance) {
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    supabaseInstance = createClient(url, key)
  }
  return supabaseInstance
})()

// Сервисный клиент для серверной части (с полными правами)
export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    const url = getSupabaseUrl()
    const key = getSupabaseServiceKey()
    supabaseAdminInstance = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdminInstance
})()
