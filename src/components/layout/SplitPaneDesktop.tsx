import type { FormSchema } from "../../types/schema";
import type { FormWizard } from "../../hooks/useFormWizard";
import type { PdfGenerationStatus } from "../../hooks/usePdfGeneration";
import { ProgressBar } from "./ProgressBar";
import { FormNavigation } from "./FormNavigation";
import { DynamicForm } from "../forms/DynamicForm";
import { ReviewStep } from "../forms/ReviewStep";
import { PdfPreview } from "../pdf/PdfPreview";

interface SplitPaneDesktopProps {
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

/** Editable form on the left, live PDF preview on the right, updated as the user types
 * (debounced in FormRunner). Used at the `lg` breakpoint and above. */
export function SplitPaneDesktop({
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
}: SplitPaneDesktopProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900">{schema.title}</h1>
      <div className="mt-4">
        <ProgressBar steps={steps} currentStep={currentStepIndex} />
      </div>
      <div className="mt-6 grid grid-cols-[3fr_2fr] gap-6 xl:gap-8">
        <div className="@container flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {view === "form" ? (
            <DynamicForm section={wizard.section} data={wizard.data} errors={wizard.errors} onFieldChange={wizard.setField} />
          ) : (
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
          )}
          <FormNavigation
            onBack={onBack}
            onNext={onNext}
            showBack={view === "review" || !wizard.isFirstSection}
            showNext={view === "form"}
            nextLabel={wizard.isLastSection ? "Ir a revisión" : "Continuar"}
            backLabel={view === "review" ? "← Volver a editar" : "← Volver"}
          />
        </div>
        <div className="sticky top-6 self-start">
          <PdfPreview url={pdfUrl} isLoading={pdfStatus === "loading"} />
        </div>
      </div>
    </div>
  );
}
