export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "date"
  | "time"
  | "radio-yesno"
  | "select"
  | "signature"
  | "static-legal-text"
  | "location"
  | "checklist-table"
  | "photo";

export type RuleType =
  | "required"
  | "minLength"
  | "maxLength"
  | "pattern"
  | "email"
  | "ci"
  | "ruc";

export interface ValidationRule {
  type: RuleType;
  value?: number | string;
  message: string;
}

/** Where/how a field's value gets drawn onto the official PDF template. pdf-lib uses a
 * bottom-left origin in PDF points — these coordinates come from extracting the real
 * label positions out of the official templates (scripts/extractPdfTextPositions.ts). */
export interface PdfBinding {
  page?: number;
  x: number;
  y: number;
  maxWidth?: number;
  maxHeight?: number;
  lineHeight?: number;
  fontSize?: number;
  minFontSize?: number;
  font?: "regular" | "bold";
  align?: "left" | "center" | "right";
  render?: "text" | "circle" | "image" | "date-parts" | "time-parts" | "email-split" | "location-map";
  /** Drawn immediately before the value, on the same baseline — for blanks on the
   * official form that have no printed sub-label of their own (e.g. the free line under
   * the Declaración Jurada where "Cargo" / "Institución" must be handwritten). */
  labelPrefix?: string;
  /** For render: "circle" — x/y is the CENTER of the printed word (SI/NO, Sí/No) being
   * circled, not a corner; radiusX/radiusY size the oval around it. */
  radiusX?: number;
  radiusY?: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  rules?: ValidationRule[];
  showIf?: { field: string; equals: unknown };
  maxLength?: number;
  pdf?: PdfBinding | PdfBinding[];
  staticText?: string;
  /** Only used when the owning FormSchema has `pdfStrategy: "acroform"` — the exact
   * name of the real fillable text field on the official template (discovered via
   * `form.getFields()`), filled directly through pdf-lib's Form API instead of drawn at
   * manual coordinates. Guarantees pixel-perfect alignment with the original. */
  acroField?: string;
  /** The target field's real rect width in PDF points (minus a little padding), used to
   * shrink the font so a long value never overflows the field's box. */
  acroMaxWidth?: number;
  /** Set on a multi-line AcroForm field (e.g. "Circunstancias") so pdf-lib wraps the
   * text across the field's own box instead of drawing it as a single line. */
  acroMultiline?: boolean;
  /** For a value that must be split across several separate single-line AcroForm fields
   * that together form one logical answer (e.g. the official template's 3 blank lines
   * for "Daños sufridos" — VA_Danios1/2/3). Wrapped word-by-word to fit `acroMaxWidth`,
   * one field per resulting line; extra text beyond the last line is dropped. */
  acroFields?: string[];
  /** Only for `type: "checklist-table"` — the rows of the table, in print order. Each
   * row's answer (one of `options`) plus its own free-text "Observaciones" is keyed by
   * `key` in the field's `ChecklistTableValue`. */
  tableRows?: { key: string; label: string }[];
  /** Only for `type: "photo"` — max number of photos this field accepts. 1 for a single
   * named slot (e.g. "Frontal"), >1 for a multi-photo bucket (e.g. "Daños Adicionales"). */
  photoMax?: number;
  /** Only consulted by `pdfStrategy: "generated"` — lets two short fields (e.g. Año /
   * Color) sit side by side in the auto-flowed layout instead of one per line. */
  layoutWidth?: "full" | "half";
}

export interface SectionSchema {
  id: string;
  title: string;
  fields: FieldSchema[];
}

export interface InternalUseRow {
  label: string;
  pdf: PdfBinding;
}

export interface FormSchema {
  id:
    | "personas-fisicas"
    | "denuncia-riesgos-varios"
    | "denuncia-transporte"
    | "denuncia-automovil"
    | "denuncia-incendio"
    | "revision-automovil";
  title: string;
  shortDescription: string;
  /** Not used by `pdfStrategy: "generated"`, which has no official template to embed. */
  templateAsset?: string;
  /** "acroform" (Personas Físicas): the official PDF has real fillable AcroForm text
   * fields — fill those directly via pdf-lib's Form API for guaranteed pixel-perfect
   * alignment. "overlay" (both denuncia forms, and the default): the official PDF is a
   * flat vector export with no fillable fields, so values are drawn at manually
   * calibrated coordinates on top of it. "generated" (Revisión de Automóvil): there is no
   * official template at all — the whole PDF is built from scratch with an auto-flowing,
   * paginating layout (see src/services/pdf/buildGeneratedPdf.ts). */
  pdfStrategy?: "overlay" | "acroform" | "generated";
  sections: SectionSchema[];
  /** Staff-only fields present on the official PDF (e.g. "USO INTERNO"). Never rendered
   * in the customer-facing form and never written to by fillPdf in this MVP — kept typed
   * here only as a seam for a future admin panel. */
  internalUseSection?: {
    title: string;
    rows: InternalUseRow[];
  };
}
