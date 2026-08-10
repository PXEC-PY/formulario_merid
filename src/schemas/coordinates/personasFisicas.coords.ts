import type { PdfBinding } from "../../types/schema";

// Personas Físicas uses pdfStrategy: "acroform" — nearly every field is filled directly
// through pdf-lib's Form API using its real AcroForm field name (see
// personasFisicas.schema.ts's `acroField`/`acroMaxWidth`), so no manual coordinates are
// needed for it. Only 3 fields still need manual placement here, because the template
// doesn't expose them as usable form fields:
//  - the two Sí/No pairs are auto-detected radio groups where BOTH widgets in each pair
//    share the same ambiguous export value, so they can't be driven through pdf-lib's
//    RadioGroup API — circled by hand instead, at the exact center of the template's own
//    tiny pre-printed "⊙" glyph (read from each widget's real /Rect via
//    `form.getFields()`, not guessed).
//  - the signature is an image, and a text field can't hold one — drawn at the exact
//    rect of the template's own (repurposed) "Firma" text field.
export const personasFisicasCoords = {
  esProveedorEstado: [
    { x: 376.1, y: 591.5, render: "circle", radiusX: 11, radiusY: 7.5 } satisfies PdfBinding, // circles "SI ⊙"
    { x: 420.4, y: 591.8, render: "circle", radiusX: 14.5, radiusY: 7.5 } satisfies PdfBinding, // circles "NO ⊙"
  ] as [PdfBinding, PdfBinding],

  esFuncionarioPublico: [
    { x: 92.7, y: 339.3, render: "circle", radiusX: 9.6, radiusY: 7.5 } satisfies PdfBinding, // circles "SI ⊙"
    { x: 112.5, y: 339.3, render: "circle", radiusX: 14.8, radiusY: 7.5 } satisfies PdfBinding, // circles "/NO ⊙"
  ] as [PdfBinding, PdfBinding],

  // Exact rect of the template's "Firma" field: [321.4, 267.7, 410.3, 287.3].
  firma: { x: 321.4, y: 267.7, maxWidth: 88.9, maxHeight: 19.6, render: "image" } satisfies PdfBinding,
};
