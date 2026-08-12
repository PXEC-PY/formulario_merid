import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { translateAuthError } from "../../services/authErrors";
import { AuthCard } from "./AuthCard";
import { baseInputClasses } from "../../components/fields/FieldWrapper";

export function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: signUpError } = await signUp(email, password, firstName, lastName);
    setLoading(false);
    if (signUpError) {
      setError(translateAuthError(signUpError));
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <AuthCard title="Cuenta creada">
        <p className="text-sm text-slate-600">
          Revisá tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.
        </p>
        <Link to="/login" className="mt-4 inline-block text-sm text-brand-700 hover:underline">
          ← Volver a iniciar sesión
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Crear cuenta" subtitle="Registrate para acceder a los formularios.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              id="firstName"
              required
              className={baseInputClasses}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
              Apellido
            </label>
            <input
              id="lastName"
              required
              className={baseInputClasses}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
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
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Continuar con Google
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-brand-700 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthCard>
  );
}
