import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { translateAuthError } from "../../services/authErrors";
import { AuthCard } from "./AuthCard";
import { baseInputClasses } from "../../components/fields/FieldWrapper";

type Stage = "checking" | "ready" | "invalid";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // PKCE puts the recovery code in the query string, not the hash — read it directly
    // rather than through a router hook, since HashRouter only parses the hash.
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code || !supabase) {
      setStage("invalid");
      return;
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      setStage(exchangeError ? "invalid" : "ready");
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(translateAuthError(updateError.message));
      return;
    }
    navigate("/");
  };

  if (stage === "checking") {
    return (
      <AuthCard title="Verificando enlace...">
        <p className="text-sm text-slate-500">Un momento...</p>
      </AuthCard>
    );
  }

  if (stage === "invalid") {
    return (
      <AuthCard title="Enlace inválido o vencido">
        <p className="text-sm text-slate-600">
          Pedí un nuevo enlace de recuperación desde la pantalla de inicio de sesión.
        </p>
        <Link to="/forgot-password" className="mt-4 inline-block text-sm text-brand-700 hover:underline">
          Solicitar nuevo enlace
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Elegí una contraseña nueva">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Contraseña nueva
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className={baseInputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            className={baseInputClasses}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">✗ {error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="min-h-11 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </AuthCard>
  );
}
