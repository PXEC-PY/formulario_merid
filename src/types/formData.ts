import type { Signature } from "./signature";

/** Value shape for a 'location' field. MVP only ever fills `label` from a plain text
 * input; `lat`/`lng` stay undefined until a future Leaflet-based picker sets them. */
export interface LocationValue {
  label: string;
  lat?: number;
  lng?: number;
}

export type FormFieldValue = string | boolean | LocationValue | Signature | undefined;

export type FormData = Record<string, FormFieldValue>;

export interface SubmissionPayload {
  formId: string;
  data: FormData;
  signature: Signature | null;
}
