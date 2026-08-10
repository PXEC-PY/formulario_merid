import type { FieldSchema } from "../../types/schema";
import { FieldWrapper, baseInputClasses, inputBorderClass } from "./FieldWrapper";

interface SelectFieldProps {
  field: FieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SelectField({ field, value, onChange, error }: SelectFieldProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  return (
    <FieldWrapper label={field.label} htmlFor={field.name} error={error} required={isRequired}>
      <select
        id={field.name}
        className={`${baseInputClasses} ${inputBorderClass(!!error, !!value)}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      >
        <option value="" disabled>
          Seleccione una opción
        </option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
