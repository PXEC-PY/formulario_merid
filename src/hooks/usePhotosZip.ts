import { useCallback, useRef, useState } from "react";
import type { FormSchema } from "../types/schema";
import type { FormData } from "../types/formData";
import { buildPhotosZip } from "../services/photos/buildPhotosZip";

export type PhotosZipStatus = "idle" | "loading" | "ready" | "error";

/** Same shape as usePdfGeneration, but triggered lazily on click instead of on every form
 * change — re-zipping ~20MB of photos on each keystroke would be wasted work. */
export function usePhotosZip(schema: FormSchema) {
  const [status, setStatus] = useState<PhotosZipStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  const generate = useCallback(
    async (data: FormData) => {
      setStatus("loading");
      setError(null);
      try {
        const blob = await buildPhotosZip(schema, data);
        const url = URL.createObjectURL(blob);
        if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = url;
        setBlobUrl(url);
        setStatus("ready");
        return url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo generar el archivo .zip");
        setStatus("error");
        return null;
      }
    },
    [schema]
  );

  return { status, error, blobUrl, generate };
}
