import type { DenunciaCoordinateMap } from "./denunciaCoordinateMap";

// Coordinates derived from `npx tsx scripts/extractPdfTextPositions.ts
// src/assets/templates/robo.pdf` (page: 612.12 x 1008.12pt, legal size). Top section
// matches riesgos-varios.pdf exactly (same master template up to "Circunstancias"); the
// "Circunstancias" wording differs, and everything below it was recalibrated on its own.
const FONT_SIZE = 9.5;
const RIGHT_MARGIN = 522;

export const roboCoords: DenunciaCoordinateMap = {
  asegurado: { x: 155, y: 793.66, maxWidth: RIGHT_MARGIN - 155, fontSize: FONT_SIZE },
  ci: { x: 118, y: 777.34, maxWidth: 233.93 - 118 - 5, fontSize: FONT_SIZE },
  ruc: { x: 269, y: 777.34, maxWidth: RIGHT_MARGIN - 269, fontSize: FONT_SIZE },
  domicilioParticular: { x: 204, y: 761.02, maxWidth: 413.95 - 204 - 5, fontSize: FONT_SIZE },
  telefonoParticular: { x: 442, y: 761.02, maxWidth: RIGHT_MARGIN - 442, fontSize: FONT_SIZE },
  domicilioComercial: { x: 205, y: 744.7, maxWidth: 413.95 - 205 - 5, fontSize: FONT_SIZE },
  telefonoComercial: { x: 442, y: 744.7, maxWidth: RIGHT_MARGIN - 442, fontSize: FONT_SIZE },
  correoElectronico: [
    { x: 262, y: 728.5, maxWidth: 374.95 - 262, fontSize: FONT_SIZE },
    { x: 392, y: 728.5, maxWidth: RIGHT_MARGIN - 392, fontSize: FONT_SIZE },
  ],
  lugarSiniestro: { x: 196, y: 712.18, maxWidth: RIGHT_MARGIN - 196, fontSize: FONT_SIZE },
  fechaSiniestro: [
    { x: 194, y: 695.86, maxWidth: 18, fontSize: FONT_SIZE, align: "center" },
    { x: 234, y: 695.86, maxWidth: 34, fontSize: FONT_SIZE, align: "center" },
    { x: 285, y: 695.86, maxWidth: 50, fontSize: FONT_SIZE, align: "center" },
  ],
  horaSiniestro: [
    { x: 442, y: 695.86, maxWidth: 16, fontSize: FONT_SIZE, align: "center" },
    { x: 467, y: 695.86, maxWidth: 20, fontSize: FONT_SIZE, align: "center" },
  ],
  circunstancias: {
    x: 89.9,
    y: 649.83,
    maxWidth: 420,
    maxHeight: 160.24,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  danosATerceros: [
    { x: 202.95, y: 489.09, render: "circle", radiusX: 9, radiusY: 7.5 },
    { x: 241.26, y: 489.09, render: "circle", radiusX: 11.5, radiusY: 7.5 },
  ],
  breveDescripcionDanos: {
    x: 89.9,
    y: 453.39,
    maxWidth: 420,
    maxHeight: 46.14,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  autoridadPolicial: [
    { x: 274.95, y: 406.75, render: "circle", radiusX: 9, radiusY: 7.5 },
    { x: 313.26, y: 406.75, render: "circle", radiusX: 11.5, radiusY: 7.5 },
  ],
  testigos: [
    { x: 166.92, y: 356.95, render: "circle", radiusX: 9, radiusY: 7.5 },
    { x: 205.26, y: 356.95, render: "circle", radiusX: 11.5, radiusY: 7.5 },
  ],
  datosTestigos: {
    x: 89.9,
    y: 321.25,
    maxWidth: 420,
    maxHeight: 45.16,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  fechaDenuncia: { x: 195, y: 272.09, maxWidth: RIGHT_MARGIN - 195, fontSize: FONT_SIZE },
  firma: { x: 312, y: 245.64, maxWidth: 200, maxHeight: 34, render: "image" },
};
