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

/** One-off connectivity check, logged to the browser console only — no UI yet, this
 * exists purely to confirm the env vars actually made it into a real deployed build
 * (nothing else imports this module yet, so without a call site it would get tree-shaken
 * out of the bundle entirely and there'd be nothing to verify). Safe to remove once the
 * real panel starts reading actual tables. */
export async function checkSupabaseConnection(): Promise<void> {
  if (!url || !anonKey) {
    console.warn("[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set in this build.");
    return;
  }
  try {
    const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: anonKey } });
    console.info(`[supabase] connectivity check: ${res.status} ${res.ok ? "OK" : "FAILED"} (${url})`);
  } catch (err) {
    console.warn("[supabase] connectivity check failed:", err);
  }
}
