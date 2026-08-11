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

export type FormFieldValue =
  | string
  | boolean
  | LocationValue
  | Signature
  | Photo[]
  | ChecklistTableValue
  | undefined;

export type FormData = Record<string, FormFieldValue>;

export interface SubmissionPayload {
  formId: string;
  data: FormData;
  signature: Signature | null;
}
