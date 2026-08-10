import type { FieldSchema } from "../../types/schema";
import type { FormFieldValue, LocationValue } from "../../types/formData";
import { isValidCi, isValidEmail, isValidPhone, isValidRuc } from "./rules";

function isEmpty(value: FormFieldValue): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "boolean") return false;
  if ("type" in value) return false; // a captured Signature — presence alone means "answered"
  const location = value as LocationValue;
  return !location.label || location.label.trim().length === 0;
}

function asString(value: FormFieldValue): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "true" : "false";
  if ("type" in value) return value.type;
  return (value as LocationValue).label ?? "";
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
