import { useMemo, useState } from "react";
import type { FormSchema } from "../types/schema";
import type { FormData, FormFieldValue } from "../types/formData";
import { validateSection, validateForm } from "../services/validation/validateSection";

export function useFormWizard(schema: FormSchema) {
  const [data, setData] = useState<FormData>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const section = schema.sections[sectionIndex];
  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === schema.sections.length - 1;
  const progress = useMemo(() => (sectionIndex + 1) / schema.sections.length, [sectionIndex, schema.sections.length]);

  const setField = (name: string, value: unknown) => {
    setData((prev) => ({ ...prev, [name]: value as FormFieldValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const goNext = (): boolean => {
    const sectionErrors = validateSection(section, data);
    if (Object.keys(sectionErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...sectionErrors }));
      return false;
    }
    if (!isLastSection) setSectionIndex((i) => i + 1);
    return true;
  };

  const goBack = () => setSectionIndex((i) => Math.max(0, i - 1));

  const goToSection = (index: number) => setSectionIndex(Math.min(Math.max(0, index), schema.sections.length - 1));

  const validateAll = (): boolean => {
    const allErrors = validateForm(schema.sections, data);
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  return {
    data,
    setField,
    section,
    sectionIndex,
    goNext,
    goBack,
    goToSection,
    isFirstSection,
    isLastSection,
    errors,
    progress,
    validateAll,
    totalSections: schema.sections.length,
  };
}

export type FormWizard = ReturnType<typeof useFormWizard>;
