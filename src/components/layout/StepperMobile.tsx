import type { FormSchema } from "../../types/schema";
import type { FormWizard } from "../../hooks/useFormWizard";
import type { PdfGenerationStatus } from "../../hooks/usePdfGeneration";
import { ProgressBar } from "./ProgressBar";
import { FormNavigation } from "./FormNavigation";
import { DynamicForm } from "../forms/DynamicForm";
import { ReviewStep } from "../forms/ReviewStep";
import { PdfPreview } from "../pdf/PdfPreview";

interface StepperMobileProps {
  schema: FormSchema;
  wizard: FormWizard;
  view: "form" | "review";
  steps: string[];
  currentStepIndex: number;
  onNext: () => void;
  onBack: () => void;
  pdfStatus: PdfGenerationStatus;
  pdfUrl: string | null;
  pdfError: string | null;
  onGeneratePdf: () => void;
  onDownload?: () => void;
}

/** Google-Forms-style single-column flow: one section per screen, big touch targets,
 * progress bar up top. Used below the `lg` breakpoint. */
export function StepperMobile({
  schema,
  wizard,
  view,
  steps,
  currentStepIndex,
  onNext,
  onBack,
  pdfStatus,
  pdfUrl,
  pdfError,
  onGeneratePdf,
  onDownload,
}: StepperMobileProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6 sm:px-6">
      <h1 className="text-xl font-bold text-slate-900">{schema.title}</h1>
      <ProgressBar steps={steps} currentStep={currentStepIndex} />
      <div className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {view === "form" ? (
          <DynamicForm section={wizard.section} data={wizard.data} errors={wizard.errors} onFieldChange={wizard.setField} />
        ) : (
          <div className="flex flex-col gap-6">
            <ReviewStep
              formTitle={schema.title}
              status={pdfStatus}
              url={pdfUrl}
              error={pdfError}
              onGenerate={onGeneratePdf}
              schema={schema}
              data={wizard.data}
              onDownload={onDownload}
            />
            <PdfPreview url={pdfUrl} isLoading={pdfStatus === "loading"} />
          </div>
        )}
      </div>
      <FormNavigation
        onBack={onBack}
        onNext={onNext}
        showBack={view === "review" || !wizard.isFirstSection}
        showNext={view === "form"}
        nextLabel={wizard.isLastSection ? "Ir a revisión" : "Continuar"}
        backLabel={view === "review" ? "← Volver a editar" : "← Volver"}
      />
    </div>
  );
}
