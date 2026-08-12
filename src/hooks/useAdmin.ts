import { supabase } from "../services/supabase";
import type { Department, Role } from "../types/roles";

export interface AdminProfileRow {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: Role;
  departmentId: string | null;
  createdAt: string;
}

function toAdminProfile(row: {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: Role;
  department_id: string | null;
  created_at: string;
}): AdminProfileRow {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    departmentId: row.department_id,
    createdAt: row.created_at,
  };
}

function toDepartment(row: { id: string; name: string; created_at: string }): Department {
  return { id: row.id, name: row.name, createdAt: row.created_at };
}

export async function listProfiles(): Promise<{ data: AdminProfileRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase no está configurado." };
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, role, department_id, created_at")
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(toAdminProfile), error: null };
}

export async function updateUserRole(userId: string, role: Role): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  return { error: error?.message ?? null };
}

export async function updateUserDepartment(userId: string, departmentId: string | null): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("profiles").update({ department_id: departmentId }).eq("id", userId);
  return { error: error?.message ?? null };
}

export async function listDepartments(): Promise<{ data: Department[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase no está configurado." };
  const { data, error } = await supabase.from("departments").select("id, name, created_at").order("name");
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(toDepartment), error: null };
}

export async function createDepartment(name: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("departments").insert({ name });
  return { error: error?.message ?? null };
}

export async function renameDepartment(id: string, name: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("departments").update({ name }).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteDepartment(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("departments").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export interface DownloadLogRow {
  id: number;
  userLabel: string;
  formId: string;
  kind: "pdf" | "photos_zip";
  ip: string | null;
  countryCode: string | null;
  countryName: string | null;
  userAgent: string | null;
  createdAt: string;
}

export async function listDownloadLog(): Promise<{ data: DownloadLogRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase no está configurado." };
  const { data, error } = await supabase
    .from("download_log")
    .select("id, email, form_id, kind, ip, country_code, country_name, user_agent, created_at")
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };

  return {
    data: (data ?? []).map((row) => ({
      id: row.id,
      userLabel: row.email ?? "—",
      formId: row.form_id,
      kind: row.kind as "pdf" | "photos_zip",
      ip: row.ip,
      countryCode: row.country_code,
      countryName: row.country_name,
      userAgent: row.user_agent,
      createdAt: row.created_at,
    })),
    error: null,
  };
}
