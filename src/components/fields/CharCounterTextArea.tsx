import type { FieldSchema } from "../../types/schema";
import { FieldWrapper, inputBorderClass } from "./FieldWrapper";

interface CharCounterTextAreaProps {
  field: FieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Textarea with a live "n / max caracteres" counter. The limit mirrors the fixed-height
 * ruled box on the official PDF (see fitText.ts) so what the user types keeps fitting the
 * printed cell instead of silently overflowing it. */
export function CharCounterTextArea({ field, value, onChange, error }: CharCounterTextAreaProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;
  const maxLength = field.maxLength;
  const count = (value ?? "").length;
  const nearLimit = maxLength ? count > maxLength * 0.9 : false;

  return (
    <FieldWrapper
      label={field.label}
      htmlFor={field.name}
      error={error}
      required={isRequired}
      hint={
        maxLength ? (
          <span className={`text-xs ${nearLimit ? "text-amber-600" : "text-slate-400"}`}>
            {count} / {maxLength} caracteres
          </span>
        ) : undefined
      }
    >
      <textarea
        id={field.name}
        className={`min-h-32 w-full resize-y rounded-lg border px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${inputBorderClass(!!error, !!value)}`}
        placeholder={field.placeholder}
        value={value ?? ""}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}
