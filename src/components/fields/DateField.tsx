import type { FieldSchema } from "../../types/schema";
import { FieldWrapper, baseInputClasses, inputBorderClass } from "./FieldWrapper";

interface DateFieldProps {
  field: FieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DateField({ field, value, onChange, error }: DateFieldProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  return (
    <FieldWrapper label={field.label} htmlFor={field.name} error={error} required={isRequired}>
      <input
        id={field.name}
        type="date"
        className={`${baseInputClasses} ${inputBorderClass(!!error, !!value)}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}
