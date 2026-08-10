import type { FieldSchema } from "../../types/schema";
import type { LocationValue } from "../../types/formData";
import { FieldWrapper, baseInputClasses, inputBorderClass } from "./FieldWrapper";

interface LocationFieldProps {
  field: FieldSchema;
  value: LocationValue | undefined;
  onChange: (value: LocationValue) => void;
  error?: string;
}

/** MVP renders a plain text input and only ever fills `label`. When the Leaflet-based
 * picker is built, it drops in here and additionally sets `lat`/`lng` — no schema change,
 * no change to how fillPdf reads the value (it only ever draws `label`). */
export function LocationField({ field, value, onChange, error }: LocationFieldProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  return (
    <FieldWrapper label={field.label} htmlFor={field.name} error={error} required={isRequired}>
      <input
        id={field.name}
        type="text"
        className={`${baseInputClasses} ${inputBorderClass(!!error, !!value?.label)}`}
        placeholder={field.placeholder ?? "Ej: Av. España 1234, Asunción"}
        value={value?.label ?? ""}
        onChange={(e) => onChange({ label: e.target.value })}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}
