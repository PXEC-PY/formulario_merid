import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { AuthCard } from "./AuthCard";

/** Landing page for the Google OAuth redirect — exchanges the PKCE `code` in the query
 * string for a real session, then sends the user home. Nothing to show here beyond a
 * brief "un momento" — the whole point is to disappear as fast as possible. */
export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code || !supabase) {
      navigate("/login");
      return;
    }
    supabase.auth.exchangeCodeForSession(code).then(() => navigate("/"));
  }, [navigate]);

  return (
    <AuthCard title="Iniciando sesión...">
      <p className="text-sm text-slate-500">Un momento...</p>
    </AuthCard>
  );
}
