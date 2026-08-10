import type { PDFFont, PDFPage } from "pdf-lib";
import type { PdfBinding } from "../../types/schema";
import { wrapText } from "../../utils/text";

/** Draws text into a fixed-height ruled cell (the official templates' free-text boxes:
 * circunstancias, daños, testigos). Wraps to the cell width and, if it still wouldn't fit
 * the available lines, shrinks the font size step by step down to `minFontSize` before
 * truncating — the box on the printed PDF never overflows. */
export function drawFittedText(page: PDFPage, font: PDFFont, text: string, binding: PdfBinding) {
  if (!text) return;

  const maxWidth = binding.maxWidth ?? 400;
  const maxHeight = binding.maxHeight ?? 100;
  const minFontSize = binding.minFontSize ?? 7;
  let fontSize = binding.fontSize ?? 10;
  const lineHeight = binding.lineHeight ?? fontSize * 1.2;
  const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));

  let lines = wrapText(text, maxWidth, (s) => font.widthOfTextAtSize(s, fontSize));
  while (lines.length > maxLines && fontSize > minFontSize) {
    fontSize -= 0.5;
    lines = wrapText(text, maxWidth, (s) => font.widthOfTextAtSize(s, fontSize));
  }

  let visibleLines = lines;
  if (lines.length > maxLines) {
    visibleLines = lines.slice(0, maxLines);
    const last = visibleLines[maxLines - 1] ?? "";
    visibleLines[maxLines - 1] = last.length > 3 ? `${last.slice(0, -3)}...` : last;
  }

  visibleLines.forEach((line, i) => {
    page.drawText(line, { x: binding.x, y: binding.y - i * lineHeight, size: fontSize, font });
  });
}
