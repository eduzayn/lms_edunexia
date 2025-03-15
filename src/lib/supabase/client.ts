import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

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
      // Add other methods as needed
    } as any;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
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
