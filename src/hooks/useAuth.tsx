import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import type { Profile } from "../types/auth";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  /** True until the initial session check resolves — lets the UI avoid flashing
   * "Iniciar sesión" for a split second before a real session is found. */
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  updateProfile: (firstName: string, lastName: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function redirectTo(path: string): string {
  // HashRouter route, built from the current origin so it works the same in dev and on
  // GitHub Pages (which serves from a /formulario_merid/ subpath).
  return `${window.location.origin}${window.location.pathname}#${path}`;
}

interface ProfileRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  role: Profile["role"];
  department_id: string | null;
  email: string | null;
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: row.created_at,
    role: row.role,
    departmentId: row.department_id,
    email: row.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, created_at, role, department_id, email")
      .eq("id", userId)
      .single();
    if (data) setProfile(toProfile(data));
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    signUp: async (email, password, firstName, lastName) => {
      if (!supabase) return { error: "Supabase no está configurado." };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      });
      return { error: error?.message ?? null };
    },
    signIn: async (email, password) => {
      if (!supabase) return { error: "Supabase no está configurado." };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      await supabase?.auth.signOut();
    },
    sendPasswordReset: async (email) => {
      if (!supabase) return { error: "Supabase no está configurado." };
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo("/reset-password") });
      return { error: error?.message ?? null };
    },
    signInWithGoogle: async () => {
      if (!supabase) return { error: "Supabase no está configurado." };
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo("/auth/callback") },
      });
      return { error: error?.message ?? null };
    },
    updateProfile: async (firstName, lastName) => {
      if (!supabase || !user) return { error: "No hay sesión activa." };
      const { error } = await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", user.id);
      if (!error) setProfile((prev) => (prev ? { ...prev, firstName, lastName } : prev));
      return { error: error?.message ?? null };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
