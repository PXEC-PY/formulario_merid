import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { translateAuthError } from "../../services/authErrors";
import { AuthCard } from "./AuthCard";
import { baseInputClasses } from "../../components/fields/FieldWrapper";

export function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: resetError } = await sendPasswordReset(email);
    setLoading(false);
    if (resetError) {
      setError(translateAuthError(resetError));
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title="Revisá tu correo">
        <p className="text-sm text-slate-600">
          Si existe una cuenta con ese correo, te enviamos un enlace para elegir una contraseña nueva.
        </p>
        <Link to="/login" className="mt-4 inline-block text-sm text-brand-700 hover:underline">
          ← Volver a iniciar sesión
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="¿Olvidaste tu contraseña?" subtitle="Te enviamos un enlace para elegir una nueva.">
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
        {error && <p className="text-sm text-red-600">✗ {error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="min-h-11 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      <Link to="/login" className="mt-4 inline-block text-sm text-brand-700 hover:underline">
        ← Volver a iniciar sesión
      </Link>
    </AuthCard>
  );
}
