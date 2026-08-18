import type { FieldSchema, FormSchema } from "../../types/schema";
import type { ChecklistMatrixValue, ChecklistTableValue, FormData, FormFieldValue, LocationValue } from "../../types/formData";
import type { Signature } from "../../types/signature";
import type { Photo } from "../../types/photo";
import { isFieldVisible } from "../../utils/fieldVisibility";
import { formatIsoDateToDisplay } from "../../utils/dateFormat";
import { BRAND_GREEN, MARGIN, PAGE_WIDTH, PageCursor, TEXT_DARK, TEXT_GRAY } from "./pageCursor";
import { drawChecklistTable } from "./drawChecklistTable";
import { drawChecklistMatrix } from "./drawChecklistMatrix";
import { appendPhotoGallery } from "./drawPhotoGallery";
import type { LabeledPhoto } from "./drawPhotoGallery";
import { loadTemplateBytes } from "./embedTemplate";
import logoMeridional from "../../assets/logo-meridional.png";

/** Entry point for `pdfStrategy: "generated"` — builds the whole PDF from scratch with an
 * auto-flowing, paginating layout instead of stamping values onto a fixed template page
 * (there is no official template for this form). Every field except `photo` is drawn
 * inline as sections are walked; photo fields are collected and rendered as gallery pages
 * appended at the very end. */
export async function buildGeneratedPdf(schema: FormSchema, data: FormData): Promise<Uint8Array> {
  const cursor = await PageCursor.create();
  await drawTitleHeader(cursor, schema.title);

  const photos: LabeledPhoto[] = [];

  for (const section of schema.sections) {
    const visible = section.fields.filter((field) => isFieldVisible(field, data));
    if (visible.length === 0) continue;

    const isPhotosOnlySection = visible.every((field) => field.type === "photo");
    if (!isPhotosOnlySection) cursor.drawSectionHeader(section.title);

    let pendingHalf: { label: string; value: string } | null = null;

    for (const field of visible) {
      const value = data[field.name];

      if (field.type === "photo") {
        collectPhotos(field, value as Photo[] | undefined, photos);
        continue;
      }
      if (field.type === "checklist-table") {
        drawChecklistTable(cursor, field, value as ChecklistTableValue | undefined);
        continue;
      }
      if (field.type === "checklist-matrix") {
        drawChecklistMatrix(cursor, field, value as ChecklistMatrixValue | undefined);
        continue;
      }
      if (field.type === "textarea") {
        cursor.drawParagraph(field.label, (value as string) ?? "");
        continue;
      }
      if (field.type === "static-legal-text") {
        cursor.drawParagraph(field.label, field.staticText ?? "");
        continue;
      }
      if (field.type === "signature") {
        await drawSignatureImage(cursor, value as Signature | undefined);
        continue;
      }

      const text = fieldValueToText(field, value);
      if (field.layoutWidth === "half") {
        if (pendingHalf) {
          cursor.drawLabelValuePair(pendingHalf.label, pendingHalf.value, field.label, text);
          pendingHalf = null;
        } else {
          pendingHalf = { label: field.label, value: text };
        }
        continue;
      }
      if (pendingHalf) {
        cursor.drawLabelValue(pendingHalf.label, pendingHalf.value);
        pendingHalf = null;
      }
      cursor.drawLabelValue(field.label, text);
    }

    if (pendingHalf) cursor.drawLabelValue(pendingHalf.label, pendingHalf.value);
  }

  await appendPhotoGallery(cursor, photos);
  stampPageNumbers(cursor);

  return cursor.outDoc.save();
}

function fieldValueToText(field: FieldSchema, value: FormFieldValue): string {
  if (value === undefined || value === null) return "";
  switch (field.type) {
    case "date":
      return typeof value === "string" && value ? formatIsoDateToDisplay(value) : "";
    case "select": {
      const opt = field.options?.find((o) => o.value === value);
      return opt?.label ?? (typeof value === "string" ? value : "");
    }
    case "location":
      return (value as LocationValue)?.label ?? "";
    case "radio-yesno":
      return value === true ? "Sí" : value === false ? "No" : "";
    default:
      return typeof value === "string" ? value : "";
  }
}

function collectPhotos(field: FieldSchema, value: Photo[] | undefined, out: LabeledPhoto[]): void {
  if (!value || value.length === 0) return;
  const multi = value.length > 1;
  value.forEach((photo, i) => out.push({ caption: multi ? `${field.label} #${i + 1}` : field.label, photo }));
}

async function drawSignatureImage(cursor: PageCursor, signature: Signature | undefined): Promise<void> {
  if (!signature || signature.type !== "handwritten-image") return;
  const base64 = signature.dataUrl.split(",")[1] ?? signature.dataUrl;
  const pngImage = await cursor.outDoc.embedPng(base64);
  const maxWidth = 150;
  const maxHeight = 50;
  const scale = Math.min(maxWidth / pngImage.width, maxHeight / pngImage.height, 1);
  const width = pngImage.width * scale;
  const height = pngImage.height * scale;

  cursor.ensureSpace(height + 18);
  cursor.page.drawText("Firma", { x: cursor.contentX, y: cursor.y - 8.5, size: 8.5, font: cursor.regular, color: TEXT_GRAY });
  cursor.y -= 8.5 + 4;
  cursor.page.drawImage(pngImage, { x: cursor.contentX, y: cursor.y - height, width, height });
  cursor.y -= height + 10;
}

async function drawTitleHeader(cursor: PageCursor, title: string): Promise<void> {
  let logoImage = null;
  try {
    const logoBytes = await loadTemplateBytes(logoMeridional);
    logoImage = await cursor.outDoc.embedPng(logoBytes);
  } catch {
    logoImage = null; // best-effort — a missing/unreadable logo shouldn't break PDF generation
  }

  const logoHeight = 34;
  let logoWidth = 0;
  if (logoImage) {
    const scale = logoHeight / logoImage.height;
    logoWidth = logoImage.width * scale;
    cursor.page.drawImage(logoImage, { x: cursor.contentX, y: cursor.y - logoHeight, width: logoWidth, height: logoHeight });
  }

  cursor.page.drawText(title, {
    x: cursor.contentX + (logoImage ? logoWidth + 12 : 0),
    y: cursor.y - logoHeight / 2 - 5,
    size: 15,
    font: cursor.bold,
    color: TEXT_DARK,
  });
  cursor.y -= logoHeight + 10;

  cursor.page.drawRectangle({ x: cursor.contentX, y: cursor.y, width: cursor.contentWidth, height: 3, color: BRAND_GREEN });
  cursor.y -= 16;
}

function stampPageNumbers(cursor: PageCursor): void {
  const pages = cursor.outDoc.getPages();
  pages.forEach((page, i) => {
    const label = `Página ${i + 1} de ${pages.length}`;
    const width = cursor.regular.widthOfTextAtSize(label, 7.5);
    page.drawText(label, { x: PAGE_WIDTH - MARGIN - width, y: MARGIN / 2, size: 7.5, font: cursor.regular, color: TEXT_GRAY });
  });
}
