import { supabase } from "./supabase";
import { fetchGeo } from "./geoLookup";

export interface DownloadLogMeta {
  formId: string;
  kind: "pdf" | "photos_zip";
}

/** Fire-and-forget: called from the download button's click handler, must never delay
 * or block the actual file download. Swallows all errors — a failed audit-log write
 * should never prevent someone from getting their document. `email` is self-reported
 * (see EmailGateModal — no password, no confirmation), not a verified identity. */
export function logDownload(meta: DownloadLogMeta, email: string): void {
  (async () => {
    if (!supabase) return;
    const geo = await fetchGeo();
    await supabase.from("download_log").insert({
      email,
      form_id: meta.formId,
      kind: meta.kind,
      ip: geo?.ip ?? null,
      country_code: geo?.countryCode ?? null,
      country_name: geo?.countryName ?? null,
      user_agent: navigator.userAgent,
    });
  })().catch(() => {});
}
