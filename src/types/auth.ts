import type { Role } from "./roles";

/** Mirrors the `public.profiles` table (supabase/migrations/0001_profiles.sql +
 * 0002_roles.sql). */
export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  role: Role;
  departmentId: string | null;
  email: string | null;
}
