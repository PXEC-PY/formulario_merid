import type { FieldSchema } from "../../types/schema";
import { FieldWrapper } from "./FieldWrapper";

interface RadioYesNoProps {
  field: FieldSchema;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  error?: string;
}

export function RadioYesNo({ field, value, onChange, error }: RadioYesNoProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;

  return (
    <FieldWrapper label={field.label} error={error} required={isRequired}>
      <div className="flex gap-3" role="radiogroup" aria-label={field.label}>
        <YesNoButton label="Sí" selected={value === true} onClick={() => onChange(true)} />
        <YesNoButton label="No" selected={value === false} onClick={() => onChange(false)} />
      </div>
    </FieldWrapper>
  );
}

function YesNoButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 flex-1 rounded-lg border-2 px-4 py-2.5 text-base font-medium transition-colors sm:flex-none sm:px-8 ${
        selected
          ? "border-brand-600 bg-brand-50 text-brand-700"
          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}
