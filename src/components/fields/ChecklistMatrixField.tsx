import type { FieldSchema } from "../../types/schema";
import type { ChecklistMatrixValue } from "../../types/formData";
import { FieldWrapper } from "./FieldWrapper";

interface ChecklistMatrixFieldProps {
  field: FieldSchema;
  value: ChecklistMatrixValue | undefined;
  onChange: (value: ChecklistMatrixValue) => void;
  error?: string;
}

/** Damage-grid checklist (e.g. "Parte Frontal (FR)"): one row per body part, one checkbox
 * column per damage type (Abollado/Roto/Desgastado/Pelado/Rayado/No Tiene) — mirrors the
 * official inspection form's layout. Unlike `ChecklistTableField`, columns aren't mutually
 * exclusive: a part can be both "Rayado" and "Abollado" at once, so each row holds a set of
 * checked option values rather than a single choice.
 *
 * Renders as a real table with a horizontally-scrolling wrapper — six columns of checkboxes
 * plus a label column don't fit narrow phone widths, so the table scrolls within its own
 * container instead of crushing the checkboxes unreadably. */
export function ChecklistMatrixField({ field, value, onChange, error }: ChecklistMatrixFieldProps) {
  const rows = field.tableRows ?? [];
  const options = field.options ?? [];
  const data = value ?? {};

  const toggle = (rowKey: string, optionValue: string) => {
    const current = data[rowKey] ?? [];
    const next = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    onChange({ ...data, [rowKey]: next });
  };

  return (
    <FieldWrapper label={field.label} error={error}>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand-50">
              <th className="sticky left-0 z-10 bg-brand-50 px-3 py-2 text-left font-semibold text-slate-700">Elemento</th>
              {options.map((opt) => (
                <th key={opt.value} className="px-1.5 py-2 text-center align-bottom text-[11px] font-semibold uppercase text-slate-600">
                  {opt.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => {
              const checked = data[row.key] ?? [];
              return (
                <tr key={row.key} className="odd:bg-white even:bg-slate-50/60">
                  <td className="sticky left-0 z-10 bg-inherit px-3 py-2 font-medium text-slate-700">{row.label}</td>
                  {options.map((opt) => (
                    <td key={opt.value} className="px-1.5 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={checked.includes(opt.value)}
                        onChange={() => toggle(row.key, opt.value)}
                        aria-label={`${row.label} — ${opt.label}`}
                        className="h-4.5 w-4.5 accent-brand-600"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </FieldWrapper>
  );
}
