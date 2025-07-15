import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Enhanced configuration check with better validation
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim().startsWith('https://') && 
  supabaseAnonKey.trim().length > 20 &&
  supabaseUrl.includes('.supabase.co')
)

// Enhanced debug logging
console.log('Supabase Configuration Check:', {
  hasUrl: !!supabaseUrl,
  urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined',
  hasKey: !!supabaseAnonKey,
  keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined',
  urlValid: supabaseUrl?.trim().startsWith('https://'),
  keyLength: supabaseAnonKey?.trim().length,
  isConfigured: isSupabaseConfigured
})

// If not configured, show helpful error message
if (!isSupabaseConfigured) {
  console.error('❌ Supabase Configuration Error:', {
    url: supabaseUrl || 'MISSING',
    key: supabaseAnonKey ? 'PROVIDED' : 'MISSING',
    help: 'Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  })
}

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

// Create and export the supabase client
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any