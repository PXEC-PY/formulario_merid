import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { baseInputClasses } from "../fields/FieldWrapper";
import { isValidEmail } from "../../services/validation/rules";

interface EmailGateModalProps {
  onSubmit: (email: string) => void;
  onClose: () => void;
}

/** Portal-based modal (same pattern as SignatureModal.tsx) shown right before a
 * download — just asks for an email, no password and no confirmation step. This is a
 * deliberately low-friction, self-reported identifier (anyone could type any address),
 * not a real login — the field staff using these forms found account creation too much
 * friction for something that only needs to answer "who generated this document". */
export function EmailGateModal({ onSubmit, onClose }: EmailGateModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Ingresá un correo electrónico válido.");
      return;
    }
    onSubmit(email.trim());
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-medium text-slate-700">Antes de descargar</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-slate-500 transition-colors hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5">
          <p className="text-sm text-slate-600">Decinos tu correo para saber quién generó este documento.</p>
          <input
            type="email"
            required
            autoFocus
            autoComplete="email"
            className={baseInputClasses}
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">✗ {error}</p>}
          <button
            type="submit"
            className="min-h-11 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Continuar y descargar
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
