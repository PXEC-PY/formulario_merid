import type { PDFFont, PDFPage } from "pdf-lib";
import type { PdfBinding } from "../../types/schema";
import { fitTextToBox } from "../../utils/text";

/** Draws text into a fixed-height ruled cell (the official templates' free-text boxes:
 * circunstancias, daños, testigos). Wraps to the cell width and, if it still wouldn't fit
 * the available lines, shrinks the font size step by step down to `minFontSize` before
 * truncating — the box on the printed PDF never overflows. */
export function drawFittedText(page: PDFPage, font: PDFFont, text: string, binding: PdfBinding) {
  if (!text) return;

  const maxWidth = binding.maxWidth ?? 400;
  const maxHeight = binding.maxHeight ?? 100;
  const minFontSize = binding.minFontSize ?? 7;
  const defaultFontSize = binding.fontSize ?? 10;

  const { lines, fontSize } = fitTextToBox(
    text,
    maxWidth,
    maxHeight,
    (s, size) => font.widthOfTextAtSize(s, size),
    defaultFontSize,
    minFontSize
  );
  const lineHeight = binding.lineHeight ?? defaultFontSize * 1.2;

  lines.forEach((line, i) => {
    page.drawText(line, { x: binding.x, y: binding.y - i * lineHeight, size: fontSize, font });
  });
}
