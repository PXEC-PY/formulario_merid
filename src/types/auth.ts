/** Mirrors the `public.profiles` table (supabase/migrations/0001_profiles.sql) — no
 * role/department fields yet, those arrive in Fase 2 once that table grows a `role`
 * column and departments exist. */
export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
}
