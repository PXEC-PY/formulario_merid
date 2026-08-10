import type { PdfBinding } from "../../types/schema";

// Denuncia Automóviles uses pdfStrategy: "acroform" — the template has 45 real, cleanly
// named AcroForm fields, so almost every field maps via `acroField` in the schema and
// needs no manual coordinates here. Only 2 things still need manual placement:
//  - the signature (no AcroForm field for it — same as Riesgos Varios/Transporte).
//  - the static map image, which replaces the top-left box of the 3x2 "croquis" grid
//    (empty rectangles with no field behind them, between the "Circunstancias" field
//    that ends at y=634 and the "DATOS DEL VEHÍCULO ASEGURADO" header at y=467.81).
export const automovilCoords = {
  // Caption "Firma del Asegurado o persona autorizada" sits at x=307.39,y=170.30.
  firma: { x: 312, y: 176, maxWidth: 200, maxHeight: 24, render: "image" } satisfies PdfBinding,

  lugarSiniestroMap: {
    x: 83.5,
    y: 565,
    maxWidth: 142.5,
    maxHeight: 65,
    render: "location-map",
  } satisfies PdfBinding,
};
