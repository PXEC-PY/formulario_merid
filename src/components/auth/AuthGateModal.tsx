import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../hooks/useAuth";
import { translateAuthError } from "../../services/authErrors";
import { baseInputClasses } from "../fields/FieldWrapper";

interface AuthGateModalProps {
  onClose: () => void;
}

type Mode = "login" | "signup";

/** Portal-based modal (same pattern as SignatureModal.tsx) that asks for login right
 * before a PDF/photos download — forms themselves stay open to everyone, this is the
 * only point where an account is required. */
export function AuthGateModal({ onClose }: AuthGateModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } =
      mode === "login" ? await signIn(email, password) : await signUp(email, password, firstName, lastName);
    setLoading(false);
    if (authError) setError(translateAuthError(authError));
    // Al loguearse con éxito, useAuth().user cambia solo — GatedDownloadLink lo detecta
    // y re-dispara la descarga; este modal se cierra desde ahí, no hace falta navegar.
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-medium text-slate-700">Iniciá sesión para descargar</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-slate-500 transition-colors hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-4 p-5">
          <p className="text-sm text-slate-600">
            El formulario ya está completo. Para descargarlo necesitamos saber quién lo generó.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={baseInputClasses}
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className={baseInputClasses}
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            )}
            <input
              type="email"
              required
              autoComplete="email"
              className={baseInputClasses}
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className={baseInputClasses}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-600">✗ {error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="min-h-11 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Un momento..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Continuar con Google
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
            className="text-sm text-brand-700 hover:underline"
          >
            {mode === "login" ? "¿No tenés cuenta? Crear cuenta" : "¿Ya tenés cuenta? Iniciar sesión"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
