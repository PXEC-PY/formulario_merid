import type { SectionSchema } from "../../types/schema";
import type { FormData } from "../../types/formData";
import { validateField } from "./validateField";
import { isFieldVisible } from "../../utils/fieldVisibility";

/** Validates every visible field of a section (fields hidden by `showIf` are skipped
 * entirely — they're not part of the form the user is currently seeing). */
export function validateSection(section: SectionSchema, data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of section.fields) {
    if (!isFieldVisible(field, data)) continue;
    const message = validateField(field, data[field.name]);
    if (message) errors[field.name] = message;
  }

  return errors;
}

export function validateForm(sections: SectionSchema[], data: FormData): Record<string, string> {
  return sections.reduce((acc, section) => ({ ...acc, ...validateSection(section, data) }), {});
}
