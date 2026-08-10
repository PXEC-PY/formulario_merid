import type { HandwrittenSignature } from "../../types/signature";

interface SignaturePreviewProps {
  signature: HandwrittenSignature;
  onRedo: () => void;
}

export function SignaturePreview({ signature, onRedo }: SignaturePreviewProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="rounded-lg border border-slate-300 bg-white p-3">
        <img src={signature.dataUrl} alt="Firma capturada" className="h-24 w-auto" />
      </div>
      <button
        type="button"
        onClick={onRedo}
        className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Firmar de nuevo
      </button>
    </div>
  );
}
