import { useState } from "react";
import type { FieldSchema } from "../../types/schema";
import type { HandwrittenSignature } from "../../types/signature";
import { SignaturePreview } from "./SignaturePreview";
import { SignatureFullscreenModal } from "./SignatureFullscreenModal";
import { FieldWrapper } from "../fields/FieldWrapper";

interface SignaturePadProps {
  field: FieldSchema;
  value: HandwrittenSignature | undefined;
  onChange: (value: HandwrittenSignature) => void;
  error?: string;
}

/** A cramped inline canvas makes for an illegible signature, especially on a phone — so
 * signing itself always happens in SignatureFullscreenModal; this component is just the
 * "Tocar para firmar" trigger and, once captured, the preview/redo state. */
export function SignaturePad({ field, value, onChange, error }: SignaturePadProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  if (value) {
    const redo = () => onChange(undefined as unknown as HandwrittenSignature);
    return (
      <FieldWrapper label={field.label} error={error} required={isRequired}>
        <SignaturePreview signature={value} onRedo={redo} />
      </FieldWrapper>
    );
  }

  const handleConfirm = (dataUrl: string) => {
    onChange({ type: "handwritten-image", dataUrl, capturedAt: new Date().toISOString() });
    setIsExpanded(false);
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
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white text-slate-500 transition-colors hover:border-brand-400 hover:bg-brand-50/40 hover:text-brand-700"
      >
        <span className="text-2xl" aria-hidden>
          ✍️
        </span>
        <span className="text-sm font-medium">Tocar para firmar</span>
      </button>
      {isExpanded && <SignatureFullscreenModal onConfirm={handleConfirm} onClose={() => setIsExpanded(false)} />}
    </FieldWrapper>
  );
}
