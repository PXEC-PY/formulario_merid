import { useCallback, useRef, useState } from "react";
import type { FormSchema } from "../types/schema";
import type { FormData } from "../types/formData";
import { fillPdf } from "../services/pdf/fillPdf";

export type PdfGenerationStatus = "idle" | "loading" | "ready" | "error";

export function usePdfGeneration(schema: FormSchema) {
  const [status, setStatus] = useState<PdfGenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  const generate = useCallback(
    async (data: FormData) => {
      setStatus("loading");
      setError(null);
      try {
        const bytes = await fillPdf(schema, data);
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = url;
        setBlobUrl(url);
        setStatus("ready");
        return url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo generar el PDF");
        setStatus("error");
        return null;
      }
    },
    [schema]
  );

  return { status, error, blobUrl, generate };
}
