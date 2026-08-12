/** Supabase Auth's error messages come in English — map the common ones to Spanish so
 * they read consistently with the rest of the app's validation messages. Falls back to
 * a generic message for anything not explicitly mapped, rather than leaking Supabase's
 * raw English text (or internal details) to the user. */
const KNOWN_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "Email not confirmed": "Todavía no confirmaste tu correo electrónico. Revisá tu bandeja de entrada.",
  "User already registered": "Ya existe una cuenta con ese correo electrónico.",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
  "Unable to validate email address: invalid format": "Ingresá un correo electrónico válido.",
  "For security purposes, you can only request this after a few seconds.":
    "Por seguridad, esperá unos segundos antes de volver a intentar.",
};

export function translateAuthError(message: string | undefined | null): string {
  if (!message) return "Ocurrió un error inesperado. Intentá de nuevo.";
  return KNOWN_MESSAGES[message] ?? "Ocurrió un error inesperado. Intentá de nuevo.";
}
