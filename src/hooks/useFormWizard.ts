import { useEffect, useMemo, useRef, useState } from "react";
import type { FormSchema } from "../types/schema";
import type { FormData, FormFieldValue } from "../types/formData";
import { validateSection, validateForm } from "../services/validation/validateSection";
import { loadDraft, saveDraft, clearDraft as clearDraftStorage } from "../utils/formPersistence";

const SAVE_DEBOUNCE_MS = 400;

export function useFormWizard(schema: FormSchema) {
  // Only read the saved draft once per form (not on every render) — schema.id is stable
  // for the lifetime of a page, so this only re-runs if the user navigates to a
  // different form while this component stays mounted (it won't, but cheap to be safe).
  const draft = useMemo(() => loadDraft(schema.id), [schema.id]);
  const [data, setData] = useState<FormData>(draft?.data ?? {});
  const [sectionIndex, setSectionIndex] = useState(() =>
    Math.min(Math.max(0, draft?.sectionIndex ?? 0), schema.sections.length - 1)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const saveTimeoutRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      saveDraft(schema.id, { data, sectionIndex });
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(saveTimeoutRef.current);
  }, [schema.id, data, sectionIndex]);

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
    // Called once the user has actually downloaded the PDF/zip — that's the "I'm done
    // with this submission" signal, not just navigating away or reloading.
    clearDraft: () => clearDraftStorage(schema.id),
  };
}

export type FormWizard = ReturnType<typeof useFormWizard>;
