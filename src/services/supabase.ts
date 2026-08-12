import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Client-side Supabase handle. Uses the public "anon" key — safe to ship in the
 * browser bundle by design, but that also means it grants NO access on its own until
 * Row Level Security policies are defined on each table (without RLS, an exposed anon
 * key can read/write everything). Never put the database's Postgres password anywhere
 * near this file or any other frontend code — that one stays out of the app entirely. */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
