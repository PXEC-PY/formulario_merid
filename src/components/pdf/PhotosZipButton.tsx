import type { PhotosZipStatus } from "../../hooks/usePhotosZip";

interface PhotosZipButtonProps {
  status: PhotosZipStatus;
  url: string | null;
  error: string | null;
  fileName: string;
  onGenerate: () => void;
}

/** Same visual language as PdfExportButton — generates on click (see usePhotosZip) rather
 * than being kept in sync automatically like the PDF preview. */
export function PhotosZipButton({ status, url, error, fileName, onGenerate }: PhotosZipButtonProps) {
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
          <a
            href={url}
            download={fileName}
            className="flex min-h-12 flex-1 items-center justify-center rounded-lg border-2 border-brand-600 px-6 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50 sm:flex-none"
          >
            Descargar fotos (.zip)
          </a>
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
