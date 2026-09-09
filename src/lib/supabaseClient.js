import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// When Supabase is not configured the app still works, it just falls back
// to localStorage for everything. See lib/storage.js.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
