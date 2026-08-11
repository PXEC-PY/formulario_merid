import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useSignaturePad } from "../../hooks/useSignaturePad";

interface SignatureModalProps {
  onConfirm: (dataUrl: string) => void;
  onClose: () => void;
}

/** Floating, centered signing dialog — opened from SignaturePad's "Tocar para firmar" box.
 * A phone-sized inline canvas makes for a cramped, illegible signature, so drawing always
 * happens here instead, in a bigger (but not edge-to-edge) box. A fresh useSignaturePad()
 * instance per mount means there's no canvas state to reset between opens.
 *
 * Rendered via a portal straight into `document.body`, not inline where SignaturePad
 * lives — `position: fixed` only escapes to the real viewport when NO ancestor has
 * `container-type`/`transform`/`filter`/etc, any of which makes that ancestor the fixed
 * element's containing block instead. The card this lives inside (DynamicForm's wrapper in
 * StepperMobile/SplitPaneDesktop) has `@container` for the checklist tables' container
 * queries, which does exactly that — so the portal keeps this dialog correctly centered on
 * the actual screen regardless of what the card above it is doing. Deliberately NOT a
 * full-viewport overlay (an earlier version was) — a fixed-size dialog is simpler to reason
 * about and always shows its own close button without relying on the box being exactly
 * 100vh tall. */
export function SignatureModal({ onConfirm, onClose }: SignatureModalProps) {
  const { canvasRef, isEmpty, clear, toDataUrl, handlers } = useSignaturePad();

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

  const confirm = () => {
    const dataUrl = toDataUrl();
    if (!dataUrl) return;
    onConfirm(dataUrl);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-medium text-slate-700">Firmá con el dedo o el mouse</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar sin guardar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-slate-500 transition-colors hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        <div className="h-64 touch-none bg-white sm:h-80">
          <canvas ref={canvasRef} className="h-full w-full touch-none" {...handlers} />
        </div>
        <div className="flex gap-3 border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={clear}
            className="min-h-12 flex-1 rounded-lg border border-slate-300 px-4 text-base font-medium text-slate-600 hover:bg-slate-50"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={isEmpty}
            className="min-h-12 flex-1 rounded-lg bg-brand-600 px-4 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Confirmar firma
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
