import type { FieldSchema } from "../../types/schema";
import type { HandwrittenSignature } from "../../types/signature";
import { useSignaturePad } from "../../hooks/useSignaturePad";
import { SignaturePreview } from "./SignaturePreview";
import { FieldWrapper } from "../fields/FieldWrapper";

interface SignaturePadProps {
  field: FieldSchema;
  value: HandwrittenSignature | undefined;
  onChange: (value: HandwrittenSignature) => void;
  error?: string;
}

export function SignaturePad({ field, value, onChange, error }: SignaturePadProps) {
  const { canvasRef, isEmpty, clear, toDataUrl, handlers } = useSignaturePad();
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  if (value) {
    const redo = () => {
      // The canvas isn't mounted while the preview is showing — reset the pad's own
      // "has content" state now so the canvas remounts blank (and gets properly sized)
      // once `value` clears, instead of remounting blank while still thinking it's full.
      clear();
      onChange(undefined as unknown as HandwrittenSignature);
    };
    return (
      <FieldWrapper label={field.label} error={error} required={isRequired}>
        <SignaturePreview signature={value} onRedo={redo} />
      </FieldWrapper>
    );
  }

  const confirm = () => {
    const dataUrl = toDataUrl();
    if (!dataUrl) return;
    onChange({ type: "handwritten-image", dataUrl, capturedAt: new Date().toISOString() });
  };

  return (
    <FieldWrapper
      label={field.label}
      error={error}
      required={isRequired}
      hint={
        <span className="text-xs text-slate-400">
          Firma manuscrita capturada como imagen — no es una firma digital certificada. Es
          opcional: podés dejarla en blanco, descargar el PDF e imprimirlo para firmar a
          mano, o abrirlo en Adobe para aplicar una firma digital certificada.
        </span>
      }
    >
      <div className="touch-none rounded-lg border-2 border-dashed border-slate-300 bg-white">
        <canvas
          ref={canvasRef}
          className="h-40 w-full touch-none rounded-lg"
          {...handlers}
        />
      </div>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={clear}
          className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={isEmpty}
          className="min-h-11 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Confirmar firma
        </button>
      </div>
    </FieldWrapper>
  );
}
