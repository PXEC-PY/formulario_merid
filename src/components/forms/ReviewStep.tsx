import type { PdfGenerationStatus } from "../../hooks/usePdfGeneration";
import { PdfExportButton } from "../pdf/PdfExportButton";

interface ReviewStepProps {
  formTitle: string;
  status: PdfGenerationStatus;
  url: string | null;
  error: string | null;
  onGenerate: () => void;
}

export function ReviewStep({ formTitle, status, url, error, onGenerate }: ReviewStepProps) {
  const fileName = `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Revisión final</h2>
        <p className="mt-1 text-sm text-slate-600">
          Revisá cuidadosamente la información antes de generar el documento.
        </p>
      </div>
      <PdfExportButton status={status} url={url} error={error} fileName={fileName} onGenerate={onGenerate} />
    </div>
  );
}
