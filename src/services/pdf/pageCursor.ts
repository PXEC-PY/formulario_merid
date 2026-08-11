import { PDFDocument, rgb } from "pdf-lib";
import type { PDFFont, PDFPage } from "pdf-lib";
import { StandardFonts } from "pdf-lib";
import { wrapText } from "../../utils/text";

export const PAGE_WIDTH = 595.28; // A4 portrait, in PDF points
export const PAGE_HEIGHT = 841.89;
export const MARGIN = 40;

// Matches --color-brand-600 (#158055) — same green already used for circled Sí/No
// answers elsewhere in the codebase (checkmarkOverlay.ts).
export const BRAND_GREEN = rgb(0.086, 0.502, 0.333);
export const BRAND_GREEN_TINT = rgb(0.91, 0.965, 0.94);
export const TEXT_DARK = rgb(0.117, 0.161, 0.216);
export const TEXT_GRAY = rgb(0.392, 0.447, 0.522);
export const BORDER_GRAY = rgb(0.82, 0.851, 0.89);

const LABEL_SIZE = 8.5;
const VALUE_SIZE = 10.5;
const ROW_GAP = 10;

/** A stateful "flowing" layout helper wrapping a pdf-lib document — the first thing in
 * this codebase that builds a PDF from scratch instead of stamping values onto a fixed
 * single-page template. Every draw* method advances `y` and calls `ensureSpace` first, so
 * content that overflows the current page transparently continues on a new one; callers
 * that need to react to a page break themselves (e.g. re-drawing a table's column header)
 * just compare `cursor.page` before/after their own `ensureSpace` call. */
export class PageCursor {
  outDoc: PDFDocument;
  regular: PDFFont;
  bold: PDFFont;
  page: PDFPage;
  y = 0;
  readonly contentX = MARGIN;
  readonly contentWidth = PAGE_WIDTH - MARGIN * 2;

  private constructor(outDoc: PDFDocument, regular: PDFFont, bold: PDFFont) {
    this.outDoc = outDoc;
    this.regular = regular;
    this.bold = bold;
    this.page = outDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  static async create(): Promise<PageCursor> {
    const outDoc = await PDFDocument.create();
    const regular = await outDoc.embedFont(StandardFonts.Helvetica);
    const bold = await outDoc.embedFont(StandardFonts.HelveticaBold);
    return new PageCursor(outDoc, regular, bold);
  }

  newPage(): void {
    this.page = this.outDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  /** Starts a new page if `height` worth of content wouldn't fit above the bottom margin. */
  ensureSpace(height: number): void {
    if (this.y - height < MARGIN) this.newPage();
  }

  drawSectionHeader(title: string): void {
    this.ensureSpace(26);
    const barHeight = 20;
    this.y -= barHeight;
    this.page.drawRectangle({ x: this.contentX, y: this.y, width: this.contentWidth, height: barHeight, color: BRAND_GREEN });
    this.page.drawText(title.toUpperCase(), {
      x: this.contentX + 8,
      y: this.y + 6,
      size: 10,
      font: this.bold,
      color: rgb(1, 1, 1),
    });
    this.y -= 12;
  }

  private drawOneLabelValue(label: string, value: string, x: number, width: number): number {
    const lines = value ? wrapText(value, width, (s) => this.regular.widthOfTextAtSize(s, VALUE_SIZE)) : [""];
    const height = LABEL_SIZE + 4 + lines.length * (VALUE_SIZE + 2);
    this.page.drawText(label, { x, y: this.y - LABEL_SIZE, size: LABEL_SIZE, font: this.regular, color: TEXT_GRAY });
    lines.forEach((line, i) => {
      this.page.drawText(line, {
        x,
        y: this.y - LABEL_SIZE - 4 - (i + 1) * (VALUE_SIZE + 2) + 2,
        size: VALUE_SIZE,
        font: this.regular,
        color: TEXT_DARK,
      });
    });
    return height;
  }

  /** One full-width "Label / value" row (value wraps across multiple lines if long). */
  drawLabelValue(label: string, value: string): void {
    const lines = value ? wrapText(value, this.contentWidth, (s) => this.regular.widthOfTextAtSize(s, VALUE_SIZE)) : [""];
    const height = LABEL_SIZE + 4 + lines.length * (VALUE_SIZE + 2) + ROW_GAP;
    this.ensureSpace(height);
    const used = this.drawOneLabelValue(label, value, this.contentX, this.contentWidth);
    this.y -= used + ROW_GAP;
  }

  /** Two "Label / value" boxes side by side, each half the content width. */
  drawLabelValuePair(leftLabel: string, leftValue: string, rightLabel: string, rightValue: string): void {
    const gutter = 16;
    const colWidth = (this.contentWidth - gutter) / 2;
    const leftLines = leftValue ? wrapText(leftValue, colWidth, (s) => this.regular.widthOfTextAtSize(s, VALUE_SIZE)) : [""];
    const rightLines = rightValue ? wrapText(rightValue, colWidth, (s) => this.regular.widthOfTextAtSize(s, VALUE_SIZE)) : [""];
    const lineCount = Math.max(leftLines.length, rightLines.length);
    const height = LABEL_SIZE + 4 + lineCount * (VALUE_SIZE + 2) + ROW_GAP;
    this.ensureSpace(height);
    this.drawOneLabelValue(leftLabel, leftValue, this.contentX, colWidth);
    this.drawOneLabelValue(rightLabel, rightValue, this.contentX + colWidth + gutter, colWidth);
    this.y -= height;
  }

  /** A free-text paragraph (textarea values) — wraps and, if long, spills onto further
   * pages a line at a time rather than being measured as one big fixed block. */
  drawParagraph(label: string, text: string): void {
    this.ensureSpace(LABEL_SIZE + 6);
    this.page.drawText(label, { x: this.contentX, y: this.y - LABEL_SIZE, size: LABEL_SIZE, font: this.regular, color: TEXT_GRAY });
    this.y -= LABEL_SIZE + 6;

    const lines = wrapText(text || "—", this.contentWidth, (s) => this.regular.widthOfTextAtSize(s, VALUE_SIZE));
    for (const line of lines) {
      this.ensureSpace(VALUE_SIZE + 3);
      this.page.drawText(line, { x: this.contentX, y: this.y - VALUE_SIZE, size: VALUE_SIZE, font: this.regular, color: TEXT_DARK });
      this.y -= VALUE_SIZE + 3;
    }
    this.y -= 4;
  }
}
