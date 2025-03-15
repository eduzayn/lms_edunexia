import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

// Default Supabase URL and key for production/deployment
const DEFAULT_SUPABASE_URL = 'https://uasnyifizdjxogowijip.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpanBpcCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA5NTY5NjAwLCJleHAiOjE3NDExMDU2MDB9.Nh0fPXLQnTcCcqshZiDYuUxV8h8ZqnQQDEMNLz2tZPE';

// Create a Supabase client for client-side usage
export const createBrowserClient = () => {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Use mock client in development mode if Supabase URL is not properly configured
  if (isDevelopment && (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('example'))) {
    console.log('Using mock Supabase client for development');
    // Return a mock client that doesn't make actual API calls
    return {
      auth: {
        signInWithPassword: async () => ({ data: { session: { user: { id: 'mock-user-id' } } }, error: null }),
        signInWithOAuth: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: { user: { id: 'mock-user-id' } } }, error: null }),
      },
      // Add other required methods with mock implementations
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        delete: () => Promise.resolve({ data: [], error: null }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: 'mock-path' }, error: null }),
          download: async () => ({ data: new Blob(), error: null }),
        }),
      },
    } as unknown as SupabaseClient<Database>;
  }
  
  // Use environment variables if available, otherwise fall back to defaults
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
};

// For use in client components
export const supabase = createBrowserClient();

// Export default values for other modules that might need them
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
