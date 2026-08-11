import type { FieldSchema } from "../../types/schema";
import type { ChecklistTableValue } from "../../types/formData";
import { wrapText } from "../../utils/text";
import { BORDER_GRAY, BRAND_GREEN, BRAND_GREEN_TINT, TEXT_DARK, TEXT_GRAY } from "./pageCursor";
import type { PageCursor } from "./pageCursor";

const HEADER_HEIGHT = 20;
const MIN_ROW_HEIGHT = 16;
const CELL_PADDING = 4;
const OPTION_COL_WIDTH = 46;
const CELL_FONT_SIZE = 8;
const LINE_HEIGHT = 10;

/** Draws one checklist table (e.g. "3.1 Carrocería y Exterior") as a bordered, shaded-
 * header grid: item label, one column per answer option (Bueno/Regular/Malo, Sí/No, ...)
 * with a check mark in the chosen one, and a free-text Observaciones column. If a row
 * wouldn't fit on the current page, the whole table transparently continues on a new page
 * with the column header row repeated — the same "flowing" behavior as the rest of the
 * `"generated"` PDF strategy (see pageCursor.ts). */
export function drawChecklistTable(cursor: PageCursor, field: FieldSchema, value: ChecklistTableValue | undefined): void {
  const rows = field.tableRows ?? [];
  const options = field.options ?? [];
  if (rows.length === 0) return;

  const labelColWidth = cursor.contentWidth * 0.34;
  const optionsWidth = OPTION_COL_WIDTH * options.length;
  const obsColWidth = cursor.contentWidth - labelColWidth - optionsWidth;
  const obsX = cursor.contentX + labelColWidth + optionsWidth;

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
    cursor.page.drawText("Elemento", { x: cursor.contentX + CELL_PADDING, y: y + 6, size: CELL_FONT_SIZE, font: cursor.bold, color: TEXT_DARK });
    options.forEach((opt, i) => {
      const colX = cursor.contentX + labelColWidth + i * OPTION_COL_WIDTH;
      const textWidth = cursor.bold.widthOfTextAtSize(opt.label, CELL_FONT_SIZE);
      cursor.page.drawText(opt.label, {
        x: colX + Math.max(0, (OPTION_COL_WIDTH - textWidth) / 2),
        y: y + 6,
        size: CELL_FONT_SIZE,
        font: cursor.bold,
        color: TEXT_DARK,
      });
      cursor.page.drawLine({ start: { x: colX, y }, end: { x: colX, y: y + HEADER_HEIGHT }, thickness: 0.75, color: BORDER_GRAY });
    });
    cursor.page.drawLine({ start: { x: obsX, y }, end: { x: obsX, y: y + HEADER_HEIGHT }, thickness: 0.75, color: BORDER_GRAY });
    cursor.page.drawText("Observaciones", { x: obsX + CELL_PADDING, y: y + 6, size: CELL_FONT_SIZE, font: cursor.bold, color: TEXT_DARK });
    cursor.y = y;
  };

  cursor.ensureSpace(HEADER_HEIGHT + MIN_ROW_HEIGHT);
  drawHeaderRow();

  for (const row of rows) {
    const rowValue = value?.[row.key];
    const obsText = rowValue?.observaciones ?? "";
    const labelLines = wrapText(row.label, labelColWidth - CELL_PADDING * 2, (s) => cursor.regular.widthOfTextAtSize(s, CELL_FONT_SIZE + 0.5));
    const obsLines = obsText ? wrapText(obsText, obsColWidth - CELL_PADDING * 2, (s) => cursor.regular.widthOfTextAtSize(s, CELL_FONT_SIZE)) : [];
    const lineCount = Math.max(labelLines.length, obsLines.length, 1);
    const rowHeight = Math.max(MIN_ROW_HEIGHT, lineCount * LINE_HEIGHT + 6);

    const pageBefore = cursor.page;
    cursor.ensureSpace(rowHeight);
    if (cursor.page !== pageBefore) drawHeaderRow();

    const y = cursor.y - rowHeight;
    cursor.page.drawRectangle({
      x: cursor.contentX,
      y,
      width: cursor.contentWidth,
      height: rowHeight,
      borderColor: BORDER_GRAY,
      borderWidth: 0.75,
    });

    labelLines.forEach((line, i) => {
      cursor.page.drawText(line, {
        x: cursor.contentX + CELL_PADDING,
        y: y + rowHeight - 11 - i * LINE_HEIGHT,
        size: CELL_FONT_SIZE + 0.5,
        font: cursor.regular,
        color: TEXT_DARK,
      });
    });

    options.forEach((opt, i) => {
      const colX = cursor.contentX + labelColWidth + i * OPTION_COL_WIDTH;
      cursor.page.drawLine({ start: { x: colX, y }, end: { x: colX, y: y + rowHeight }, thickness: 0.75, color: BORDER_GRAY });
      if (rowValue?.option === opt.value) drawCheckMark(cursor, colX + OPTION_COL_WIDTH / 2, y + rowHeight / 2);
    });

    cursor.page.drawLine({ start: { x: obsX, y }, end: { x: obsX, y: y + rowHeight }, thickness: 0.75, color: BORDER_GRAY });
    obsLines.forEach((line, i) => {
      cursor.page.drawText(line, {
        x: obsX + CELL_PADDING,
        y: y + rowHeight - 11 - i * LINE_HEIGHT,
        size: CELL_FONT_SIZE,
        font: cursor.regular,
        color: TEXT_GRAY,
      });
    });

    cursor.y = y;
  }

  cursor.y -= 10;
}

function drawCheckMark(cursor: PageCursor, cx: number, cy: number): void {
  const size = 8;
  cursor.page.drawRectangle({
    x: cx - size / 2,
    y: cy - size / 2,
    width: size,
    height: size,
    borderColor: BRAND_GREEN,
    borderWidth: 1,
    color: BRAND_GREEN_TINT,
  });
  cursor.page.drawLine({ start: { x: cx - 2.4, y: cy - 0.2 }, end: { x: cx - 0.6, y: cy - 2 }, thickness: 1.2, color: BRAND_GREEN });
  cursor.page.drawLine({ start: { x: cx - 0.6, y: cy - 2 }, end: { x: cx + 2.6, y: cy + 2.4 }, thickness: 1.2, color: BRAND_GREEN });
}
