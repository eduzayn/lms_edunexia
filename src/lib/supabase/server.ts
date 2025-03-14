import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../../types/supabase';

export const getServerClient = () => {
  const cookieStore = cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
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
