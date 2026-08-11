import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { FieldSchema } from "../../types/schema";
import type { Photo } from "../../types/photo";
import { resizeImageToDataUrl } from "../../utils/imageResize";
import { FieldWrapper } from "./FieldWrapper";

interface PhotoFieldProps {
  field: FieldSchema;
  value: Photo[];
  onChange: (value: Photo[]) => void;
  error?: string;
}

/** Multi-file photo capture, following SignaturePad's "value present → preview, otherwise
 * capture control" shape. Every file goes through resizeImageToDataUrl before it ever
 * reaches form state — a raw camera photo is routinely several MB and this form can hold
 * ~20 of them, so shrinking eagerly (not at PDF-build time) is what keeps things fast. */
export function PhotoField({ field, value, onChange, error }: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;
  const max = field.photoMax ?? 1;
  const remaining = Math.max(0, max - value.length);

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, remaining);
    e.target.value = "";
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const newPhotos: Photo[] = [];
      for (const file of files) {
        const dataUrl = await resizeImageToDataUrl(file);
        newPhotos.push({ id: crypto.randomUUID(), dataUrl, capturedAt: new Date().toISOString(), fileName: file.name });
      }
      onChange([...value, ...newPhotos]);
    } finally {
      setIsProcessing(false);
    }
  };

  const removePhoto = (id: string) => onChange(value.filter((p) => p.id !== id));

  return (
    <FieldWrapper label={field.label} error={error} required={isRequired}>
      <div className="flex flex-col gap-3">
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {value.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                <img src={photo.dataUrl} alt={field.label} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Quitar foto de ${field.label}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm font-bold leading-none text-white hover:bg-black/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
            className="min-h-11 rounded-lg border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Procesando..." : value.length > 0 ? "Agregar otra foto" : max > 1 ? "Agregar fotos" : "Tomar / subir foto"}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple={max > 1}
          onChange={handleFiles}
          className="hidden"
        />
      </div>
    </FieldWrapper>
  );
}
