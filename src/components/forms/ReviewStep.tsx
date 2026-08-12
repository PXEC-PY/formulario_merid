import type { FormSchema } from "../../types/schema";
import type { FormData } from "../../types/formData";
import type { PdfGenerationStatus } from "../../hooks/usePdfGeneration";
import { usePhotosZip } from "../../hooks/usePhotosZip";
import { PdfExportButton } from "../pdf/PdfExportButton";
import { PhotosZipButton } from "../pdf/PhotosZipButton";

interface ReviewStepProps {
  formTitle: string;
  status: PdfGenerationStatus;
  url: string | null;
  error: string | null;
  onGenerate: () => void;
  schema: FormSchema;
  data: FormData;
  /** Fired once the user actually downloads the PDF or the photos zip — clears the
   * autosaved draft for this form (see useFormWizard's clearDraft). */
  onDownload?: () => void;
}

export function ReviewStep({ formTitle, status, url, error, onGenerate, schema, data, onDownload }: ReviewStepProps) {
  const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const fileName = `${slug}.pdf`;
  const zip = usePhotosZip(schema);
  const hasPhotos = schema.sections.some((section) =>
    section.fields.some((field) => field.type === "photo" && ((data[field.name] as unknown[]) ?? []).length > 0)
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Revisión final</h2>
        <p className="mt-1 text-sm text-slate-600">
          Revisá cuidadosamente la información antes de generar el documento.
        </p>
      </div>
      <PdfExportButton
        status={status}
        url={url}
        error={error}
        fileName={fileName}
        formId={schema.id}
        onGenerate={onGenerate}
        onDownload={onDownload}
      />
      {hasPhotos && (
        <PhotosZipButton
          status={zip.status}
          url={zip.blobUrl}
          error={zip.error}
          fileName={`${slug}-fotos.zip`}
          formId={schema.id}
          onGenerate={() => zip.generate(data)}
          onDownload={onDownload}
        />
      )}
    </div>
  );
}
