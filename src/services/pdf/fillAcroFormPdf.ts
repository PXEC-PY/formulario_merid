import { PDFDocument, PDFTextField, StandardFonts } from "pdf-lib";
import type { FormSchema, FieldSchema } from "../../types/schema";
import type { FormData, LocationValue } from "../../types/formData";
import { loadTemplateBytes } from "./embedTemplate";
import { drawField, type PdfFonts } from "./drawField";
import { isFieldVisible } from "../../utils/fieldVisibility";
import { formatIsoDateToDisplay } from "../../utils/dateFormat";
import { computeFittingFontSize, truncateToWidth } from "../../utils/text";

const ACRO_FONT_SIZE = 10;
const ACRO_MIN_FONT_SIZE = 6;

/** For a field whose type isn't already a plain string (select/date/location), returns
 * the text that should actually be typed into the AcroForm field. */
function resolveDisplayValue(field: FieldSchema, value: FormData[string]): string {
  if (value === undefined || value === null) return "";
  if (field.type === "date") return formatIsoDateToDisplay(String(value));
  if (field.type === "select") {
    const option = field.options?.find((o) => o.value === value);
    return option?.label ?? String(value);
  }
  if (field.type === "location") return (value as LocationValue).label ?? "";
  return String(value);
}

/** A few of the template's auto-detected fields (e.g. "Texto2") have no /DA (default
 * appearance) entry of their own — pdf-lib's setFontSize() needs one to already exist so
 * it can parse+modify it. Give it a plain one before touching it. */
function ensureDefaultAppearance(textField: PDFTextField) {
  const acroField = textField.acroField;
  if (!acroField.getDefaultAppearance()) {
    acroField.setDefaultAppearance("/Helv 10 Tf 0 g");
  }
}

function setFieldText(textField: PDFTextField, text: string, size: number) {
  ensureDefaultAppearance(textField);
  textField.setFontSize(size);
  textField.setText(text);
}

/** Fills the real fillable AcroForm text fields on the official template directly —
 * guarantees the same alignment a person gets typing into the PDF by hand in Adobe or
 * Chrome, since it's the exact same fields. Falls back to the manual-coordinate overlay
 * (`drawField`) only for the handful of fields the template doesn't expose as a usable
 * form field: the two Sí/No circles (the auto-detected radio groups share one ambiguous
 * export value per pair, so they can't be driven through the RadioGroup API) and the
 * handwritten signature image (a text field can't hold an image). */
export async function fillAcroFormPdf(schema: FormSchema, data: FormData): Promise<Uint8Array> {
  const bytes = await loadTemplateBytes(schema.templateAsset);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  const page = doc.getPage(0);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const fonts: PdfFonts = { regular };

  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (!isFieldVisible(field, data)) continue;
      const value = data[field.name];

      if (field.acroField) {
        const text = resolveDisplayValue(field, value);
        if (!text) continue;
        const textField = form.getTextField(field.acroField);
        const maxWidth = field.acroMaxWidth;
        const size = maxWidth
          ? computeFittingFontSize(text, maxWidth, (s, sz) => regular.widthOfTextAtSize(s, sz), ACRO_FONT_SIZE, ACRO_MIN_FONT_SIZE)
          : ACRO_FONT_SIZE;
        const renderText = maxWidth ? truncateToWidth(text, maxWidth, (s) => regular.widthOfTextAtSize(s, size)) : text;
        setFieldText(textField, renderText, size);
        continue;
      }

      // Cargo + Institución: the template only has ONE blank line for both ("Texto2"),
      // handled together right after this loop — skip them here.
      if (field.name === "cargo" || field.name === "institucion") continue;

      if (field.pdf) {
        await drawField(page, doc, fonts, field, value);
      }
    }
  }

  const cargo = (data.cargo as string | undefined) ?? "";
  const institucion = (data.institucion as string | undefined) ?? "";
  if (cargo || institucion) {
    const combined = [cargo, institucion].filter(Boolean).join(" — ");
    const texto2 = form.getTextField("Texto2");
    const maxWidth = 133; // Texto2 field rect width minus a little padding
    const size = computeFittingFontSize(combined, maxWidth, (s, sz) => regular.widthOfTextAtSize(s, sz), 9, 6);
    setFieldText(texto2, truncateToWidth(combined, maxWidth, (s) => regular.widthOfTextAtSize(s, size)), size);
  }

  form.updateFieldAppearances(regular);
  form.flatten();
  return doc.save();
}
