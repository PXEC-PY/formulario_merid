import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";
import { translateAuthError } from "../services/authErrors";
import { baseInputClasses } from "../components/fields/FieldWrapper";

function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PY", { dateStyle: "short", timeStyle: "short" });
}

export function ProfilePage() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center text-sm text-slate-600 sm:px-6">
        Necesitás iniciar sesión para ver tu perfil.
      </div>
    );
  }

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    const { error } = await updateProfile(firstName, lastName);
    setSavingProfile(false);
    setProfileMessage(error ? translateAuthError(error) : "Datos actualizados.");
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }
    if (!supabase) return;
    setPasswordError(null);
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordError(translateAuthError(error.message));
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Contraseña actualizada.");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {profile?.firstName ?? ""} {profile?.lastName ?? ""}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <span className="text-emerald-500">🟢</span> Activo
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Información personal</h2>
        <form onSubmit={handleSaveProfile} className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                Nombre
              </label>
              <input
                id="firstName"
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
                className={baseInputClasses}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Correo</span>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div>
              <span className="font-medium text-slate-700">Fecha de creación</span>
              <p>{formatDate(profile?.createdAt)}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Último acceso</span>
              <p>{formatDate(user.last_sign_in_at)}</p>
            </div>
          </div>
          {profileMessage && <p className="text-sm text-brand-700">{profileMessage}</p>}
          <button
            type="submit"
            disabled={savingProfile}
            className="min-h-11 w-fit rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {savingProfile ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Seguridad</h2>
        <form onSubmit={handleChangePassword} className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                Contraseña nueva
              </label>
              <input
                id="newPassword"
                type="password"
                minLength={6}
                autoComplete="new-password"
                className={baseInputClasses}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Confirmar
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={baseInputClasses}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {passwordError && <p className="text-sm text-red-600">✗ {passwordError}</p>}
          {passwordMessage && <p className="text-sm text-brand-700">{passwordMessage}</p>}
          <button
            type="submit"
            disabled={savingPassword || !newPassword}
            className="min-h-11 w-fit rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {savingPassword ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={handleSignOut}
        className="min-h-11 w-fit rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
