import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { translateAuthError } from "../../services/authErrors";
import { AuthCard } from "./AuthCard";
import { baseInputClasses } from "../../components/fields/FieldWrapper";

export function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(translateAuthError(signInError));
      return;
    }
    navigate("/");
  };

  return (
    <AuthCard title="Iniciar sesión" subtitle="Ingresá con tu correo y contraseña.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className={baseInputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className={baseInputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">✗ {error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="min-h-11 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Continuar con Google
        </button>
      </form>
      <div className="mt-4 flex flex-col gap-1.5 text-sm text-slate-600">
        <Link to="/forgot-password" className="text-brand-700 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <span>
          ¿No tenés cuenta?{" "}
          <Link to="/signup" className="text-brand-700 hover:underline">
            Crear cuenta
          </Link>
        </span>
      </div>
    </AuthCard>
  );
}
