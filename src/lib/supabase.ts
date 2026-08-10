import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Cliente Supabase para chamadas do lado do navegador (Public/Anon)
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Cliente Supabase seguro para chamadas do servidor (Service Role / Privilegiado)
 */
export const getSupabaseAdminClient = (): SupabaseClient | null => {
  if (!supabaseUrl) return null;
  
  const keyToUse = supabaseServiceRoleKey || supabaseAnonKey;
  if (!keyToUse) return null;

  return createClient(supabaseUrl, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
