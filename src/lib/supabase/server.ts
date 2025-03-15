import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../../types/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './client';

export const getServerClient = () => {
  const cookieStore = cookies();
  
  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          // @ts-expect-error - Next.js types are not fully compatible with Supabase SSR
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // @ts-expect-error - Next.js types are not fully compatible with Supabase SSR
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          // @ts-expect-error - Next.js types are not fully compatible with Supabase SSR
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

// This is the function that the admin pages are importing
export const createServerSupabaseClient = () => {
  return getServerClient();
};

// Alias for getUser to support existing code
export const getServerUser = async () => {
  return getUser();
};

export const getServiceRoleClient = () => {
  const cookieStore = cookies();
  
  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
      cookies: {
        get(name: string) {
          // @ts-expect-error - Next.js types are not fully compatible with Supabase SSR
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // @ts-expect-error - Next.js types are not fully compatible with Supabase SSR
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          // @ts-expect-error - Next.js types are not fully compatible with Supabase SSR
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  return supabase;
};

export const getUser = async () => {
  const supabase = getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
