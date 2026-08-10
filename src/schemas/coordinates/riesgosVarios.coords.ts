import type { DenunciaCoordinateMap } from "./denunciaCoordinateMap";

// Coordinates derived from `npx tsx scripts/extractPdfTextPositions.ts
// src/assets/templates/riesgos-varios.pdf` (page: 612.12 x 1008.12pt, legal size).
const FONT_SIZE = 9.5;
const RIGHT_MARGIN = 522;

export const riesgosVariosCoords: DenunciaCoordinateMap = {
  asegurado: { x: 155, y: 793.66, maxWidth: RIGHT_MARGIN - 155, fontSize: FONT_SIZE },
  ci: { x: 118, y: 777.34, maxWidth: 233.93 - 118 - 5, fontSize: FONT_SIZE },
  ruc: { x: 269, y: 777.34, maxWidth: RIGHT_MARGIN - 269, fontSize: FONT_SIZE },
  domicilioParticular: { x: 204, y: 761.02, maxWidth: 413.95 - 204 - 5, fontSize: FONT_SIZE },
  telefonoParticular: { x: 442, y: 761.02, maxWidth: RIGHT_MARGIN - 442, fontSize: FONT_SIZE },
  domicilioComercial: { x: 205, y: 744.7, maxWidth: 413.95 - 205 - 5, fontSize: FONT_SIZE },
  telefonoComercial: { x: 442, y: 744.7, maxWidth: RIGHT_MARGIN - 442, fontSize: FONT_SIZE },
  correoElectronico: [
    { x: 262, y: 728.5, maxWidth: 374.95 - 262, fontSize: FONT_SIZE }, // local part (before @)
    { x: 392, y: 728.5, maxWidth: RIGHT_MARGIN - 392, fontSize: FONT_SIZE }, // domain (after @)
  ],
  lugarSiniestro: { x: 196, y: 712.18, maxWidth: RIGHT_MARGIN - 196, fontSize: FONT_SIZE },
  fechaSiniestro: [
    { x: 194, y: 695.86, maxWidth: 18, fontSize: FONT_SIZE, align: "center" }, // dd
    { x: 234, y: 695.86, maxWidth: 34, fontSize: FONT_SIZE, align: "center" }, // mm
    { x: 285, y: 695.86, maxWidth: 50, fontSize: FONT_SIZE, align: "center" }, // yyyy
  ],
  horaSiniestro: [
    { x: 442, y: 695.86, maxWidth: 16, fontSize: FONT_SIZE, align: "center" }, // hh
    { x: 467, y: 695.86, maxWidth: 20, fontSize: FONT_SIZE, align: "center" }, // mm
  ],
  circunstancias: {
    x: 89.9,
    y: 649.83,
    maxWidth: 420,
    maxHeight: 127.6,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  danosATerceros: [
    { x: 202.95, y: 521.73, render: "circle", radiusX: 9, radiusY: 7.5 }, // circles "Sí"
    { x: 241.26, y: 521.73, render: "circle", radiusX: 11.5, radiusY: 7.5 }, // circles "No"
  ],
  breveDescripcionDanos: {
    x: 89.9,
    y: 486.03,
    maxWidth: 420,
    maxHeight: 111.3,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  autoridadPolicial: [
    { x: 274.95, y: 374.23, render: "circle", radiusX: 9, radiusY: 7.5 },
    { x: 313.26, y: 374.23, render: "circle", radiusX: 11.5, radiusY: 7.5 },
  ],
  testigos: [
    { x: 166.92, y: 324.43, render: "circle", radiusX: 9, radiusY: 7.5 },
    { x: 205.26, y: 324.43, render: "circle", radiusX: 11.5, radiusY: 7.5 },
  ],
  datosTestigos: {
    x: 89.9,
    y: 288.73,
    maxWidth: 420,
    maxHeight: 45.19,
    fontSize: FONT_SIZE,
    minFontSize: 7,
    lineHeight: 12.5,
  },
  fechaDenuncia: { x: 195, y: 239.54, maxWidth: RIGHT_MARGIN - 195, fontSize: FONT_SIZE },
  firma: { x: 312, y: 213, maxWidth: 200, maxHeight: 34, render: "image" },
};
