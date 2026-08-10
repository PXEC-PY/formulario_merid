import type { FieldSchema } from "../../types/schema";
import { FieldWrapper, baseInputClasses, inputBorderClass } from "./FieldWrapper";

interface TimeFieldProps {
  field: FieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TimeField({ field, value, onChange, error }: TimeFieldProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  return (
    <FieldWrapper label={field.label} htmlFor={field.name} error={error} required={isRequired}>
      <input
        id={field.name}
        type="time"
        className={`${baseInputClasses} ${inputBorderClass(!!error, !!value)}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}
