export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wprkpdqnmibxphiofoqk.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr';
export const IS_SUPABASE_CONFIGURED = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export const SUPABASE_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export const SUPABASE_OPTIONS = {
  auth: { persistSession: false },
  global: { headers: SUPABASE_HEADERS }
};
