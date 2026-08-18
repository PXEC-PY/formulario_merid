import type { FieldSchema } from "../../types/schema";
import type { ChecklistMatrixValue } from "../../types/formData";
import { wrapText } from "../../utils/text";
import { BORDER_GRAY, BRAND_GREEN, BRAND_GREEN_TINT, TEXT_DARK } from "./pageCursor";
import type { PageCursor } from "./pageCursor";

const HEADER_HEIGHT = 24;
const ROW_HEIGHT = 14;
const CELL_PADDING = 4;
const HEADER_FONT_SIZE = 6.5;
const LABEL_FONT_SIZE = 8;

/** Draws a damage-grid checklist (e.g. "Parte Frontal (FR)") as a bordered table: one row
 * per body part, one checkbox column per damage type — mirroring `drawChecklistTable`'s
 * page-break/repeated-header behavior, but with checkmarks in every matching column
 * instead of a single radio choice, and no free-text Observaciones column (the official
 * form doesn't have one here). */
export function drawChecklistMatrix(cursor: PageCursor, field: FieldSchema, value: ChecklistMatrixValue | undefined): void {
  const rows = field.tableRows ?? [];
  const options = field.options ?? [];
  if (rows.length === 0 || options.length === 0) return;

  const optionColWidth = (cursor.contentWidth * 0.62) / options.length;
  const labelColWidth = cursor.contentWidth - optionColWidth * options.length;

  const drawHeaderRow = () => {
    cursor.ensureSpace(HEADER_HEIGHT);
    const y = cursor.y - HEADER_HEIGHT;
    cursor.page.drawRectangle({
      x: cursor.contentX,
      y,
      width: cursor.contentWidth,
      height: HEADER_HEIGHT,
      color: BRAND_GREEN_TINT,
      borderColor: BORDER_GRAY,
      borderWidth: 0.75,
    });
    cursor.page.drawText("Elemento", { x: cursor.contentX + CELL_PADDING, y: y + HEADER_HEIGHT / 2 - 3, size: HEADER_FONT_SIZE + 1, font: cursor.bold, color: TEXT_DARK });
    options.forEach((opt, i) => {
      const colX = cursor.contentX + labelColWidth + i * optionColWidth;
      const lines = wrapText(opt.label.toUpperCase(), optionColWidth - 4, (s) => cursor.bold.widthOfTextAtSize(s, HEADER_FONT_SIZE));
      lines.slice(0, 2).forEach((line, li) => {
        const textWidth = cursor.bold.widthOfTextAtSize(line, HEADER_FONT_SIZE);
        cursor.page.drawText(line, {
          x: colX + Math.max(0, (optionColWidth - textWidth) / 2),
          y: y + HEADER_HEIGHT / 2 + (lines.length > 1 ? 4 : 0) - li * 8 - 3,
          size: HEADER_FONT_SIZE,
          font: cursor.bold,
          color: TEXT_DARK,
        });
      });
      cursor.page.drawLine({ start: { x: colX, y }, end: { x: colX, y: y + HEADER_HEIGHT }, thickness: 0.75, color: BORDER_GRAY });
    });
    cursor.y = y;
  };

  cursor.ensureSpace(HEADER_HEIGHT + ROW_HEIGHT);
  drawHeaderRow();

  for (const row of rows) {
    const checked = value?.[row.key] ?? [];

    const pageBefore = cursor.page;
    cursor.ensureSpace(ROW_HEIGHT);
    if (cursor.page !== pageBefore) drawHeaderRow();

    const y = cursor.y - ROW_HEIGHT;
    cursor.page.drawRectangle({
      x: cursor.contentX,
      y,
      width: cursor.contentWidth,
      height: ROW_HEIGHT,
      borderColor: BORDER_GRAY,
      borderWidth: 0.75,
    });

    const label = wrapText(row.label, labelColWidth - CELL_PADDING * 2, (s) => cursor.regular.widthOfTextAtSize(s, LABEL_FONT_SIZE))[0] ?? row.label;
    cursor.page.drawText(label, { x: cursor.contentX + CELL_PADDING, y: y + ROW_HEIGHT / 2 - 3, size: LABEL_FONT_SIZE, font: cursor.regular, color: TEXT_DARK });

    options.forEach((opt, i) => {
      const colX = cursor.contentX + labelColWidth + i * optionColWidth;
      cursor.page.drawLine({ start: { x: colX, y }, end: { x: colX, y: y + ROW_HEIGHT }, thickness: 0.75, color: BORDER_GRAY });
      if (checked.includes(opt.value)) drawCheckMark(cursor, colX + optionColWidth / 2, y + ROW_HEIGHT / 2);
    });

    cursor.y = y;
  }

  cursor.y -= 10;
}

function drawCheckMark(cursor: PageCursor, cx: number, cy: number): void {
  const size = 7;
  cursor.page.drawRectangle({
    x: cx - size / 2,
    y: cy - size / 2,
    width: size,
    height: size,
    borderColor: BRAND_GREEN,
    borderWidth: 1,
    color: BRAND_GREEN_TINT,
  });
  cursor.page.drawLine({ start: { x: cx - 2.1, y: cy - 0.2 }, end: { x: cx - 0.5, y: cy - 1.8 }, thickness: 1.1, color: BRAND_GREEN });
  cursor.page.drawLine({ start: { x: cx - 0.5, y: cy - 1.8 }, end: { x: cx + 2.3, y: cy + 2.1 }, thickness: 1.1, color: BRAND_GREEN });
}
