import { PDFDocument, StandardFonts } from "pdf-lib";
import type { FormSchema } from "../../types/schema";
import type { FormData } from "../../types/formData";
import { embedTemplateBackground } from "./embedTemplate";
import { drawField } from "./drawField";
import { isFieldVisible } from "../../utils/fieldVisibility";
import { fillAcroFormPdf } from "./fillAcroFormPdf";

/** Entry point used by usePdfGeneration — dispatches to whichever of the two generation
 * strategies the schema declares (see `FormSchema.pdfStrategy`). */
export async function fillPdf(schema: FormSchema, data: FormData): Promise<Uint8Array> {
  if (schema.pdfStrategy === "acroform") {
    return fillAcroFormPdf(schema, data);
  }
  return fillOverlayPdf(schema, data);
}

/** Overlay strategy: embed the official template as a vector background, then draw each
 * schema field's current value at its calibrated coordinate. Used by both denuncia
 * forms, whose templates have no fillable AcroForm fields. */
async function fillOverlayPdf(schema: FormSchema, data: FormData): Promise<Uint8Array> {
  const outDoc = await PDFDocument.create();
  const page = await embedTemplateBackground(outDoc, schema.templateAsset);
  const regular = await outDoc.embedFont(StandardFonts.Helvetica);

  for (const section of schema.sections) {
    for (const field of section.fields) {
      // A field hidden by `showIf` (e.g. Cargo/Institución when not a public official)
      // was never shown to the user and must never leave a mark on the PDF, even if it
      // has a `labelPrefix` — otherwise its prefix prints on the printed line by itself.
      if (!isFieldVisible(field, data)) continue;
      await drawField(page, outDoc, { regular }, field, data[field.name]);
    }
  }

  return outDoc.save();
}
