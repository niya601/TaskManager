import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
  },
  from: () => ({
    select: () => ({ 
      eq: () => ({ 
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    insert: () => ({ 
      select: () => ({ 
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      })
    }),
    update: () => ({ 
      eq: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      })
    }),
    delete: () => ({ 
      eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
    }),
  }),
})

export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any