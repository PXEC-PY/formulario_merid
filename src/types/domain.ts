// Placeholder types only — nothing in the app reads or writes these yet. They exist so
// the future backend/claims module extends the data model additively instead of forcing
// a redesign of FormSchema/FieldSchema, which deliberately describe "a form and how it
// maps onto its PDF", not "how it gets submitted or stored".
import type { FormData } from "./formData";
import type { Signature } from "./signature";

export interface Siniestro {
  id: string;
  formId: string;
  data: FormData;
  signature: Signature;
  submittedAt: string;
  status: "draft" | "submitted" | "reviewed";
}

export interface AuthUser {
  id: string;
  email: string;
  role: "customer" | "staff" | "admin";
}
