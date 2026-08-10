import type { FieldSchema } from "../types/schema";
import type { FormData } from "../types/formData";

export function isFieldVisible(field: FieldSchema, data: FormData): boolean {
  if (!field.showIf) return true;
  return data[field.showIf.field] === field.showIf.equals;
}
