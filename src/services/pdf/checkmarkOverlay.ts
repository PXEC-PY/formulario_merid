import type { PDFPage } from "pdf-lib";
import { rgb } from "pdf-lib";
import type { PdfBinding } from "../../types/schema";

/** Marks a Sí/No option the way it's done by hand on the paper form: circling the chosen
 * word. `binding.x/y` is the center of the printed word (see coordinates/*.coords.ts). */
export function drawSelectionCircle(page: PDFPage, binding: PdfBinding) {
  page.drawEllipse({
    x: binding.x,
    y: binding.y,
    xScale: binding.radiusX ?? 9,
    yScale: binding.radiusY ?? 7.5,
    borderColor: rgb(0.08, 0.5, 0.33),
    borderWidth: 1.4,
  });
}
