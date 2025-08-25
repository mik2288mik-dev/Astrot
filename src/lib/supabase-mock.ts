// Mock Supabase client for local development
export const supabaseMock = {
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: (data: any) => Promise.resolve({ data, error: null }),
    update: (data: any) => ({
      eq: () => Promise.resolve({ data, error: null }),
      match: () => Promise.resolve({ data, error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
      match: () => Promise.resolve({ data: null, error: null })
    }),
    upsert: (data: any) => Promise.resolve({ data, error: null })
  }),
  
  auth: {
    getUser: () => Promise.resolve({ 
      data: { 
        user: { 
          id: 'mock-user-id',
          email: 'user@example.com' 
        } 
      }, 
      error: null 
    }),
    signIn: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: { path: 'mock-path' }, error: null }),
      download: () => Promise.resolve({ data: new Blob(), error: null }),
      remove: () => Promise.resolve({ data: null, error: null })
    })
  }
}

export function getSupabaseMockClient() {
  return supabaseMock
}