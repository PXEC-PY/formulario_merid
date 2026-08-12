import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Client-side Supabase handle. Uses the public "anon" key — safe to ship in the
 * browser bundle by design, but that also means it grants NO access on its own until
 * Row Level Security policies are defined on each table (without RLS, an exposed anon
 * key can read/write everything). Never put the database's Postgres password anywhere
 * near this file or any other frontend code — that one stays out of the app entirely.
 *
 * flowType: "pkce" — the app uses HashRouter (GitHub Pages has no server-side route
 * rewriting), which owns the "#..." part of the URL for routing. Supabase's classic
 * "implicit" flow puts auth tokens in that same hash fragment on redirect, which would
 * collide with the router. PKCE instead redirects with a `?code=...` query param, which
 * coexists cleanly with a hash route (e.g. ".../#/reset-password?code=xxxx"). */
export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { flowType: "pkce" } }) : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
