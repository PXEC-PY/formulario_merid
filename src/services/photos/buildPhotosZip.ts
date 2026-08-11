import JSZip from "jszip";
import type { FormSchema } from "../../types/schema";
import type { FormData } from "../../types/formData";
import type { Photo } from "../../types/photo";
import { isFieldVisible } from "../../utils/fieldVisibility";

const DIACRITICS = /[̀-ͯ]/g;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(DIACRITICS, "") // strip accents (á→a, ñ→n, ...)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Bundles every photo across all `type: "photo"` fields into a single .zip blob, one
 * file per photo, named after its slot label (with an index suffix for a multi-photo
 * slot like "Daños Adicionales"). */
export async function buildPhotosZip(schema: FormSchema, data: FormData): Promise<Blob> {
  const zip = new JSZip();

  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.type !== "photo" || !isFieldVisible(field, data)) continue;
      const photos = (data[field.name] as Photo[] | undefined) ?? [];
      const baseName = slugify(field.label);

      photos.forEach((photo, i) => {
        const base64 = photo.dataUrl.split(",")[1] ?? photo.dataUrl;
        const isPng = photo.dataUrl.startsWith("data:image/png");
        const suffix = photos.length > 1 ? `-${i + 1}` : "";
        zip.file(`${baseName}${suffix}.${isPng ? "png" : "jpg"}`, base64, { base64: true });
      });
    }
  }

  return zip.generateAsync({ type: "blob" });
}
