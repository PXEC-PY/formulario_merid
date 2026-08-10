import type { PdfBinding } from "../../types/schema";

// Both denuncia forms (Riesgos Varios / Transporte de Mercaderías) share this exact
// field set — only the numeric coordinates differ, one map per template.
export interface DenunciaCoordinateMap {
  asegurado: PdfBinding;
  ci: PdfBinding;
  ruc: PdfBinding;
  domicilioParticular: PdfBinding;
  telefonoParticular: PdfBinding;
  domicilioComercial: PdfBinding;
  telefonoComercial: PdfBinding;
  correoElectronico: [PdfBinding, PdfBinding];
  lugarSiniestro: PdfBinding;
  fechaSiniestro: [PdfBinding, PdfBinding, PdfBinding];
  horaSiniestro: [PdfBinding, PdfBinding];
  circunstancias: PdfBinding;
  danosATerceros: [PdfBinding, PdfBinding];
  breveDescripcionDanos: PdfBinding;
  autoridadPolicial: [PdfBinding, PdfBinding];
  testigos: [PdfBinding, PdfBinding];
  datosTestigos: PdfBinding;
  fechaDenuncia: PdfBinding;
  firma: PdfBinding;
}
