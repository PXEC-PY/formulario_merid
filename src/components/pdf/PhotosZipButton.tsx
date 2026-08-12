import type { PhotosZipStatus } from "../../hooks/usePhotosZip";
import { GatedDownloadLink } from "./GatedDownloadLink";

interface PhotosZipButtonProps {
  status: PhotosZipStatus;
  url: string | null;
  error: string | null;
  fileName: string;
  formId: string;
  onGenerate: () => void;
  /** Fired when the user actually clicks the download link — the "I'm done with this
   * submission" signal used to clear the autosaved draft. */
  onDownload?: () => void;
}

/** Same visual language as PdfExportButton — generates on click (see usePhotosZip) rather
 * than being kept in sync automatically like the PDF preview. */
export function PhotosZipButton({ status, url, error, fileName, formId, onGenerate, onDownload }: PhotosZipButtonProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onGenerate}
          disabled={status === "loading"}
          className="min-h-12 flex-1 rounded-lg border-2 border-slate-300 px-6 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {status === "loading" ? "Preparando fotos..." : url ? "Regenerar .zip de fotos" : "Preparar fotos (.zip)"}
        </button>
        {url && status === "ready" && (
          <GatedDownloadLink
            href={url}
            fileName={fileName}
            onAuthorizedDownload={onDownload}
            logMeta={{ formId, kind: "photos_zip" }}
            className="flex min-h-12 flex-1 items-center justify-center rounded-lg border-2 border-brand-600 px-6 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50 sm:flex-none"
          >
            Descargar fotos (.zip)
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
