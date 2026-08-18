import type { Signature } from "./signature";
import type { Photo } from "./photo";

/** Value shape for a 'location' field. MVP only ever fills `label` from a plain text
 * input; `lat`/`lng` stay undefined until a future Leaflet-based picker sets them. */
export interface LocationValue {
  label: string;
  lat?: number;
  lng?: number;
}

/** One row's answer in a 'checklist-table' field — `option` is one of the field's
 * `options[].value` (e.g. "bueno"/"regular"/"malo" or "si"/"no"). */
export interface ChecklistRowValue {
  option: string;
  observaciones?: string;
}

/** Value shape for a 'checklist-table' field, keyed by each row's `tableRows[].key`. */
export type ChecklistTableValue = Record<string, ChecklistRowValue>;

/** Value shape for a 'checklist-matrix' field (e.g. the FR/TR/LI/LD damage grids) —
 * keyed by each row's `tableRows[].key`, holding the list of checked `options[].value`
 * for that row (a part can be checked in more than one column at once). */
export type ChecklistMatrixValue = Record<string, string[]>;

export type FormFieldValue =
  | string
  | boolean
  | LocationValue
  | Signature
  | Photo[]
  | ChecklistTableValue
  | ChecklistMatrixValue
  | undefined;

export type FormData = Record<string, FormFieldValue>;

export interface SubmissionPayload {
  formId: string;
  data: FormData;
  signature: Signature | null;
}
