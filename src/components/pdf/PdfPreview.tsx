interface PdfPreviewProps {
  url: string | null;
  isLoading?: boolean;
}

export function PdfPreview({ url, isLoading }: PdfPreviewProps) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
        Generando vista previa...
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">
        <span className="text-3xl">📄</span>
        Complete el formulario para ver la vista previa del documento oficial.
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title="Vista previa del PDF"
      className="h-full min-h-[420px] w-full rounded-lg border border-slate-200 bg-white lg:min-h-[720px]"
    />
  );
}
