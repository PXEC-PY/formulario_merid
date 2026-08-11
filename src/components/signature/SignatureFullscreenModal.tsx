import { useEffect } from "react";
import { useSignaturePad } from "../../hooks/useSignaturePad";

interface SignatureFullscreenModalProps {
  onConfirm: (dataUrl: string) => void;
  onClose: () => void;
}

/** Full-viewport signing surface, opened from SignaturePad's "Tocar para firmar" box — a
 * phone-sized inline canvas makes for a cramped, illegible signature, so actual drawing
 * always happens here instead. A fresh useSignaturePad() instance per mount means there's
 * no canvas state to reset between opens (unlike the old inline pad). */
export function SignatureFullscreenModal({ onConfirm, onClose }: SignatureFullscreenModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
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
      <div className="flex-1 touch-none">
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
  );
}
