import type { PdfGenerationStatus } from "../../hooks/usePdfGeneration";
import { GatedDownloadLink } from "./GatedDownloadLink";

interface PdfExportButtonProps {
  status: PdfGenerationStatus;
  url: string | null;
  error: string | null;
  fileName: string;
  formId: string;
  onGenerate: () => void;
  /** Fired when the user actually clicks the download link — the "I'm done with this
   * submission" signal used to clear the autosaved draft. */
  onDownload?: () => void;
}

export function PdfExportButton({ status, url, error, fileName, formId, onGenerate, onDownload }: PdfExportButtonProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onGenerate}
          disabled={status === "loading"}
          className="min-h-12 flex-1 rounded-lg bg-brand-600 px-6 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:flex-none"
        >
          {status === "loading" ? "Generando PDF..." : url ? "Regenerar PDF" : "Generar PDF"}
        </button>
        {url && status === "ready" && (
          <GatedDownloadLink
            href={url}
            fileName={fileName}
            onAuthorizedDownload={onDownload}
            logMeta={{ formId, kind: "pdf" }}
            className="flex min-h-12 flex-1 items-center justify-center rounded-lg border-2 border-brand-600 px-6 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50 sm:flex-none"
          >
            Descargar PDF
          </GatedDownloadLink>
        )}
      </div>
      {status === "error" && error && (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <span aria-hidden>✗</span> {error}
        </p>
      )}
    </div>
  );
}
