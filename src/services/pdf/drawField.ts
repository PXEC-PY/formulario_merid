import type { PDFDocument, PDFFont, PDFPage } from "pdf-lib";
import type { FieldSchema, PdfBinding } from "../../types/schema";
import type { FormFieldValue, LocationValue } from "../../types/formData";
import type { HandwrittenSignature } from "../../types/signature";
import { drawFittedText } from "./fitText";
import { drawSelectionCircle } from "./checkmarkOverlay";
import { formatIsoDateToDisplay, splitIsoDate, splitTime } from "../../utils/dateFormat";
import { computeFittingFontSize, truncateToWidth } from "../../utils/text";

export interface PdfFonts {
  regular: PDFFont;
}

/** Draws a single line of text. When the value is longer than its calibrated cell
 * (a long full name, address, employer, etc.), shrinks the font down to `minFontSize`
 * before finally truncating with an ellipsis — the printed line never overflows past the
 * neighboring field or the table's right edge. */
function drawSimpleText(page: PDFPage, font: PDFFont, text: string, binding: PdfBinding) {
  if (!text) return;
  const maxWidth = binding.maxWidth;
  const minSize = binding.minFontSize ?? 6.5;
  const defaultSize = binding.fontSize ?? 10;
  let size = defaultSize;
  let renderText = text;

  if (maxWidth) {
    size = computeFittingFontSize(text, maxWidth, (s, sz) => font.widthOfTextAtSize(s, sz), defaultSize, minSize);
    renderText = truncateToWidth(text, maxWidth, (s) => font.widthOfTextAtSize(s, size));
  }

  let x = binding.x;
  if (binding.align === "center" && maxWidth) {
    const width = font.widthOfTextAtSize(renderText, size);
    x = binding.x + Math.max(0, (maxWidth - width) / 2);
  }
  page.drawText(renderText, { x, y: binding.y, size, font });
}

/** Draws one field's current value onto the output page at its schema-defined
 * coordinates. Dispatches purely on `field.type` / the shape of `field.pdf` — this
 * function is identical for all 3 forms, it never branches on which form it's filling. */
export async function drawField(
  page: PDFPage,
  outDoc: PDFDocument,
  fonts: PdfFonts,
  field: FieldSchema,
  value: FormFieldValue
): Promise<void> {
  if (!field.pdf) return;

  switch (field.type) {
    case "text":
    case "phone":
    case "select": {
      const binding = field.pdf as PdfBinding;
      const text = `${binding.labelPrefix ?? ""}${value ?? ""}`;
      drawSimpleText(page, fonts.regular, text, binding);
      break;
    }

    case "email": {
      const text = (value as string) ?? "";
      if (Array.isArray(field.pdf)) {
        const [localBinding, domainBinding] = field.pdf as [PdfBinding, PdfBinding];
        const atIndex = text.indexOf("@");
        const local = atIndex >= 0 ? text.slice(0, atIndex) : text;
        const domain = atIndex >= 0 ? text.slice(atIndex + 1) : "";
        drawSimpleText(page, fonts.regular, local, localBinding);
        drawSimpleText(page, fonts.regular, domain, domainBinding);
      } else {
        drawSimpleText(page, fonts.regular, text, field.pdf as PdfBinding);
      }
      break;
    }

    case "location": {
      const loc = value as LocationValue | undefined;
      drawSimpleText(page, fonts.regular, loc?.label ?? "", field.pdf as PdfBinding);
      break;
    }

    case "date": {
      const iso = (value as string) ?? "";
      if (Array.isArray(field.pdf)) {
        const [dayBinding, monthBinding, yearBinding] = field.pdf as [PdfBinding, PdfBinding, PdfBinding];
        const parts = splitIsoDate(iso);
        if (parts) {
          drawSimpleText(page, fonts.regular, parts.day, dayBinding);
          drawSimpleText(page, fonts.regular, parts.month, monthBinding);
          drawSimpleText(page, fonts.regular, parts.year, yearBinding);
        }
      } else {
        drawSimpleText(page, fonts.regular, formatIsoDateToDisplay(iso), field.pdf as PdfBinding);
      }
      break;
    }

    case "time": {
      if (Array.isArray(field.pdf)) {
        const [hourBinding, minuteBinding] = field.pdf as [PdfBinding, PdfBinding];
        const parts = splitTime((value as string) ?? "");
        if (parts) {
          drawSimpleText(page, fonts.regular, parts.hour, hourBinding);
          drawSimpleText(page, fonts.regular, parts.minute, minuteBinding);
        }
      }
      break;
    }

    case "radio-yesno": {
      const [yesBinding, noBinding] = field.pdf as [PdfBinding, PdfBinding];
      if (value === true) drawSelectionCircle(page, yesBinding);
      if (value === false) drawSelectionCircle(page, noBinding);
      break;
    }

    case "textarea": {
      drawFittedText(page, fonts.regular, (value as string) ?? "", field.pdf as PdfBinding);
      break;
    }

    case "signature": {
      const signature = value as HandwrittenSignature | undefined;
      if (!signature) break;
      const binding = field.pdf as PdfBinding;
      const base64 = signature.dataUrl.split(",")[1] ?? signature.dataUrl;
      const pngImage = await outDoc.embedPng(base64);
      const maxWidth = binding.maxWidth ?? 150;
      const maxHeight = binding.maxHeight ?? 40;
      const scale = Math.min(maxWidth / pngImage.width, maxHeight / pngImage.height, 1);
      page.drawImage(pngImage, {
        x: binding.x,
        y: binding.y,
        width: pngImage.width * scale,
        height: pngImage.height * scale,
      });
      break;
    }

    default:
      break;
  }
}
