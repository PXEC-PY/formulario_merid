import type { FieldSchema } from "../../types/schema";
import { FieldWrapper, baseInputClasses, inputBorderClass } from "./FieldWrapper";

interface TextFieldProps {
  field: FieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const HTML_TYPE: Record<string, string> = {
  text: "text",
  email: "email",
  phone: "tel",
};

export function TextField({ field, value, onChange, error }: TextFieldProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  return (
    <FieldWrapper label={field.label} htmlFor={field.name} error={error} required={isRequired}>
      <input
        id={field.name}
        type={HTML_TYPE[field.type] ?? "text"}
        inputMode={field.type === "phone" ? "tel" : field.type === "email" ? "email" : undefined}
        className={`${baseInputClasses} ${inputBorderClass(!!error, !!value)}`}
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}
