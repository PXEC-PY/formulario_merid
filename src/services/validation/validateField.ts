import type { FieldSchema } from "../../types/schema";
import type { ChecklistMatrixValue, ChecklistTableValue, FormFieldValue, LocationValue } from "../../types/formData";
import type { Signature } from "../../types/signature";
import { isValidCi, isValidEmail, isValidPhone, isValidRuc } from "./rules";

// `ChecklistTableValue` is a `Record<string, ChecklistRowValue>`, so a plain `"type" in
// value` / `"label" in value` check doesn't structurally rule it out for TS (its index
// signature could technically have either key) — named predicates keep the narrowing
// explicit instead of fighting the compiler at each call site.
function isSignature(value: object): value is Signature {
  return "type" in value;
}
function isLocationValue(value: object): value is LocationValue {
  return "label" in value;
}

function isEmpty(value: FormFieldValue): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return value.length === 0; // Photo[]
  if (isSignature(value)) return false; // presence alone means "answered"
  if (isLocationValue(value)) return !value.label || value.label.trim().length === 0;
  const rowValues = Object.values(value);
  // ChecklistMatrixValue — each row holds an array of checked option values.
  if (rowValues.every((row) => Array.isArray(row))) {
    const matrixRows = value as ChecklistMatrixValue;
    return !Object.values(matrixRows).some((checked) => checked.length > 0);
  }
  // ChecklistTableValue — empty iff no row has an answer yet.
  const rows = value as ChecklistTableValue;
  return !Object.values(rows).some((row) => !!row?.option);
}

function asString(value: FormFieldValue): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return `${value.length} foto(s)`;
  if (isSignature(value)) return value.type;
  if (isLocationValue(value)) return value.label ?? "";
  return "";
}

/** Runs a single field's declarative rules against its current value. Returns the first
 * failing rule's message, or null when the field is valid. */
export function validateField(field: FieldSchema, value: FormFieldValue): string | null {
  const rules = field.rules ?? [];
  const empty = isEmpty(value);

  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (empty) return rule.message;
        break;
      case "minLength":
        if (!empty && asString(value).trim().length < Number(rule.value)) return rule.message;
        break;
      case "maxLength":
        if (!empty && asString(value).length > Number(rule.value)) return rule.message;
        break;
      case "pattern":
        if (!empty && !new RegExp(String(rule.value)).test(asString(value))) return rule.message;
        break;
      case "email":
        if (!empty && !isValidEmail(asString(value))) return rule.message;
        break;
      case "ci":
        if (!empty && !isValidCi(asString(value))) return rule.message;
        break;
      case "ruc":
        if (!empty && !isValidRuc(asString(value))) return rule.message;
        break;
    }
  }

  if (field.type === "phone" && !empty && !isValidPhone(asString(value))) {
    return "Ingrese un teléfono válido";
  }

  return null;
}
