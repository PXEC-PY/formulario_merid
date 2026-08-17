import { PDFDocument, PDFTextField, StandardFonts } from "pdf-lib";
import type { FormSchema, FieldSchema } from "../../types/schema";
import type { FormData, LocationValue } from "../../types/formData";
import { loadTemplateBytes } from "./embedTemplate";
import { drawField, type PdfFonts } from "./drawField";
import { isFieldVisible } from "../../utils/fieldVisibility";
import { formatIsoDateToDisplay } from "../../utils/dateFormat";
import { computeFittingFontSize, fitTextToBox, truncateToWidth, wrapText } from "../../utils/text";

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

function setFieldText(textField: PDFTextField, text: string, size: number, multiline?: boolean) {
  ensureDefaultAppearance(textField);
  if (multiline) textField.enableMultiline();
  textField.setFontSize(size);
  textField.setText(text);
}

/** Fills the real fillable AcroForm text fields on the official template directly —
 * guarantees the same alignment a person gets typing into the PDF by hand in Adobe or
 * Chrome, since it's the exact same fields. Falls back to the manual-coordinate overlay
 * (`drawField`) for the handful of things the template doesn't expose as a usable text
 * field: Sí/No circles, the handwritten signature image, and (Automóviles) the static
 * map snapshot drawn into the croquis box. A field can use both at once (e.g. "Lugar del
 * siniestro" writes its address into a real text field AND gets a map image overlaid
 * elsewhere on the page). */
export async function fillAcroFormPdf(schema: FormSchema, data: FormData): Promise<Uint8Array> {
  if (!schema.templateAsset) throw new Error(`El formulario "${schema.id}" no tiene una plantilla PDF configurada`);
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

      // Cargo + Institución (Personas Físicas): the template only has ONE blank line for
      // both ("Texto2"), handled together right after this loop — skip here.
      if (field.name === "cargo" || field.name === "institucion") continue;

      if (field.acroFields && field.acroFields.length > 0) {
        const text = resolveDisplayValue(field, value);
        if (text) {
          // These are single, short-height (~10pt) lines on the official template — a
          // smaller font than the rest of the form leaves visible clearance from the
          // printed row border above/below instead of touching it.
          const size = 8;
          const maxWidth = field.acroMaxWidth ?? 200;
          const lines = wrapText(text, maxWidth, (s) => regular.widthOfTextAtSize(s, size));
          field.acroFields.forEach((acroFieldName, i) => {
            const line = lines[i];
            if (line) setFieldText(form.getTextField(acroFieldName), line, size);
          });
        }
      } else if (field.acroField) {
        const text = resolveDisplayValue(field, value);
        if (text) {
          const textField = form.getTextField(field.acroField);
          const maxWidth = field.acroMaxWidth;

          if (field.acroMultiline) {
            // Word-wrap across the field's actual height instead of single-line-truncating —
            // a multiline AcroForm field (e.g. "Circunstancias", "Daños sufridos...") is a real
            // multi-row box on the printed template, not a single wide line.
            const rect = textField.acroField.getWidgets()[0]?.getRectangle();
            const width = maxWidth ?? rect?.width ?? 400;
            const height = rect?.height ?? 40;
            const { lines, fontSize } = fitTextToBox(
              text,
              width,
              height,
              (s, sz) => regular.widthOfTextAtSize(s, sz),
              ACRO_FONT_SIZE,
              ACRO_MIN_FONT_SIZE
            );
            setFieldText(textField, lines.join("\n"), fontSize, true);
          } else {
            const size = maxWidth
              ? computeFittingFontSize(text, maxWidth, (s, sz) => regular.widthOfTextAtSize(s, sz), ACRO_FONT_SIZE, ACRO_MIN_FONT_SIZE)
              : ACRO_FONT_SIZE;
            const renderText = maxWidth ? truncateToWidth(text, maxWidth, (s) => regular.widthOfTextAtSize(s, size)) : text;
            setFieldText(textField, renderText, size);
          }
        }
      }

      if (field.pdf) {
        await drawField(page, doc, fonts, field, value);
      }
    }
  }

  const cargo = (data.cargo as string | undefined) ?? "";
  const institucion = (data.institucion as string | undefined) ?? "";
  if (cargo || institucion) {
    const combined = [cargo, institucion].filter(Boolean).join(" — ");
    const texto2Field = form.getFields().find((f) => f.getName() === "Texto2");
    if (texto2Field) {
      const texto2 = form.getTextField("Texto2");
      const maxWidth = 133; // Texto2 field rect width minus a little padding
      const size = computeFittingFontSize(combined, maxWidth, (s, sz) => regular.widthOfTextAtSize(s, sz), 9, 6);
      setFieldText(texto2, truncateToWidth(combined, maxWidth, (s) => regular.widthOfTextAtSize(s, size)), size);
    }
  }

  form.updateFieldAppearances(regular);
  form.flatten();
  return doc.save();
}
