import type { DenunciaCoordinateMap } from "./denunciaCoordinateMap";

// Coordinates derived from `npx tsx scripts/extractPdfTextPositions.ts
// src/assets/templates/cristales.pdf` (page: 612.12 x 1008.12pt, legal size). Same
// master Word template as the other denuncia forms, but this one has no "Daños a
// terceros" section at all, so everything below "Circunstancias" sits higher up the
// page — calibrated on its own, not copied from riesgosVarios.coords.ts.
const FONT_SIZE = 9.5;
const RIGHT_MARGIN = 522;

export const cristalesCoords: DenunciaCoordinateMap = {
  asegurado: { x: 155, y: 764.14, maxWidth: RIGHT_MARGIN - 155, fontSize: FONT_SIZE },
  ci: { x: 118, y: 747.82, maxWidth: 233.93 - 118 - 5, fontSize: FONT_SIZE },
  ruc: { x: 269, y: 747.82, maxWidth: RIGHT_MARGIN - 269, fontSize: FONT_SIZE },
  domicilioParticular: { x: 204, y: 731.62, maxWidth: 413.95 - 204 - 5, fontSize: FONT_SIZE },
  telefonoParticular: { x: 442, y: 731.62, maxWidth: RIGHT_MARGIN - 442, fontSize: FONT_SIZE },
  domicilioComercial: { x: 205, y: 715.3, maxWidth: 413.95 - 205 - 5, fontSize: FONT_SIZE },
  telefonoComercial: { x: 442, y: 715.3, maxWidth: RIGHT_MARGIN - 442, fontSize: FONT_SIZE },
  correoElectronico: [
    { x: 262, y: 698.98, maxWidth: 374.95 - 262, fontSize: FONT_SIZE },
    { x: 392, y: 698.98, maxWidth: RIGHT_MARGIN - 392, fontSize: FONT_SIZE },
  ],
  lugarSiniestro: { x: 196, y: 682.63, maxWidth: RIGHT_MARGIN - 196, fontSize: FONT_SIZE },
  fechaSiniestro: [
    { x: 194, y: 666.43, maxWidth: 18, fontSize: FONT_SIZE, align: "center" },
    { x: 234, y: 666.43, maxWidth: 34, fontSize: FONT_SIZE, align: "center" },
    { x: 285, y: 666.43, maxWidth: 50, fontSize: FONT_SIZE, align: "center" },
  ],
  horaSiniestro: [
    { x: 442, y: 666.43, maxWidth: 16, fontSize: FONT_SIZE, align: "center" },
    { x: 467, y: 666.43, maxWidth: 20, fontSize: FONT_SIZE, align: "center" },
  ],
  circunstancias: {
    x: 89.9,
    y: 620.43,
    maxWidth: 420,
    maxHeight: 143.92,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  // No danosATerceros / breveDescripcionDanos — this form has no such section.
  autoridadPolicial: [
    { x: 274.95, y: 476.01, render: "circle", radiusX: 9, radiusY: 7.5 },
    { x: 313.26, y: 476.01, render: "circle", radiusX: 11.5, radiusY: 7.5 },
  ],
  testigos: [
    { x: 166.92, y: 426.19, render: "circle", radiusX: 9, radiusY: 7.5 },
    { x: 205.26, y: 426.19, render: "circle", radiusX: 11.5, radiusY: 7.5 },
  ],
  datosTestigos: {
    x: 89.9,
    y: 390.49,
    maxWidth: 420,
    maxHeight: 12.64,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  fechaDenuncia: { x: 195, y: 373.85, maxWidth: RIGHT_MARGIN - 195, fontSize: FONT_SIZE },
  firma: { x: 312, y: 347.43, maxWidth: 200, maxHeight: 34, render: "image" },
};
