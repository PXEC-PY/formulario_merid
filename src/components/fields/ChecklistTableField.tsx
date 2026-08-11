import type { FieldSchema } from "../../types/schema";
import type { ChecklistRowValue, ChecklistTableValue } from "../../types/formData";
import { FieldWrapper } from "./FieldWrapper";

interface ChecklistTableFieldProps {
  field: FieldSchema;
  value: ChecklistTableValue | undefined;
  onChange: (value: ChecklistTableValue) => void;
  error?: string;
}

/** One row per `field.tableRows` entry: item label, a pill-button group generalizing
 * RadioYesNo's Sí/No pattern to N options (Bueno/Regular/Malo, Sí/No, ...), and a short
 * free-text Observaciones input. Validation is intentionally lenient (an inspector may
 * leave inapplicable rows blank) so nothing here blocks the wizard from advancing.
 *
 * Uses container queries (`@xl:`), not viewport ones (`sm:`) — this table also renders
 * inside the notebook/tablet-landscape split-pane review layout, where the form column
 * can be under 550px even though the browser window itself is plenty wide. A viewport
 * breakpoint would still force the row layout there and crush the Observaciones input to
 * a couple of visible characters; a container breakpoint correctly falls back to the
 * stacked layout instead, keyed off the column's own rendered width. Requires an
 * ancestor with the `@container` class (added on the card wrapping DynamicForm in both
 * StepperMobile and SplitPaneDesktop). */
export function ChecklistTableField({ field, value, onChange, error }: ChecklistTableFieldProps) {
  const rows = field.tableRows ?? [];
  const options = field.options ?? [];
  const data = value ?? {};

  const setRow = (key: string, patch: Partial<ChecklistRowValue>) => {
    const current: ChecklistRowValue = data[key] ?? { option: "" };
    onChange({ ...data, [key]: { ...current, ...patch } });
  };

  return (
    <FieldWrapper label={field.label} error={error}>
      <div className="flex flex-col divide-y divide-slate-200 rounded-lg border border-slate-200">
        {rows.map((row) => {
          const rowValue = data[row.key];
          return (
            <div key={row.key} className="flex flex-col gap-2 p-3 @xl:flex-row @xl:items-center @xl:gap-4">
              <span className="text-sm font-medium text-slate-700 @xl:w-40 @xl:flex-none">{row.label}</span>
              <div className="flex flex-wrap gap-2 @xl:flex-none" role="radiogroup" aria-label={row.label}>
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={rowValue?.option === opt.value}
                    onClick={() => setRow(row.key, { option: opt.value })}
                    className={`min-h-9 rounded-md border px-3 text-xs font-medium transition-colors ${
                      rowValue?.option === opt.value
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={rowValue?.observaciones ?? ""}
                onChange={(e) => setRow(row.key, { observaciones: e.target.value })}
                placeholder="Observaciones"
                className="min-h-9 w-full flex-1 rounded-md border border-slate-300 px-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
