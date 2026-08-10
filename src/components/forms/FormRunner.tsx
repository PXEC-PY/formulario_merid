import { useEffect, useRef, useState } from "react";
import type { FormSchema } from "../../types/schema";
import { useFormWizard } from "../../hooks/useFormWizard";
import { usePdfGeneration } from "../../hooks/usePdfGeneration";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { StepperMobile } from "../layout/StepperMobile";
import { SplitPaneDesktop } from "../layout/SplitPaneDesktop";

/** Runs the full flow (steps → review → PDF) for any FormSchema. The 3 form pages are
 * one-line wrappers around this — nothing here is specific to a particular form. */
export function FormRunner({ schema }: { schema: FormSchema }) {
  const wizard = useFormWizard(schema);
  const pdf = usePdfGeneration(schema);
  const isDesktop = useIsDesktop();
  const [view, setView] = useState<"form" | "review">("form");
  const debounceRef = useRef<number | undefined>(undefined);

  const steps = [...schema.sections.map((s) => s.title), "Revisión"];
  const currentStepIndex = view === "review" ? steps.length - 1 : wizard.sectionIndex;

  const handleNext = () => {
    const advanced = wizard.goNext();
    if (advanced && wizard.isLastSection) setView("review");
  };

  const handleBack = () => {
    if (view === "review") setView("form");
    else wizard.goBack();
  };

  useEffect(() => {
    if (!isDesktop && view !== "review") return;
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(
      () => {
        pdf.generate(wizard.data);
      },
      view === "review" ? 0 : 600
    );
    return () => window.clearTimeout(debounceRef.current);
    // Re-run whenever the form data changes, regardless of which section is active.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(wizard.data), view, isDesktop]);

  const shared = {
    schema,
    wizard,
    view,
    steps,
    currentStepIndex,
    onNext: handleNext,
    onBack: handleBack,
    pdfStatus: pdf.status,
    pdfUrl: pdf.blobUrl,
    pdfError: pdf.error,
    onGeneratePdf: () => pdf.generate(wizard.data),
  };

  return isDesktop ? <SplitPaneDesktop {...shared} /> : <StepperMobile {...shared} />;
}
