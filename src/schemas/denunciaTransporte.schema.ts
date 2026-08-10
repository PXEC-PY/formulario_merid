import { buildDenunciaSchema } from "./denunciaBase.schema";
import { transporteCoords } from "./coordinates/transporte.coords";
import transportePdf from "../assets/templates/transporte-mercaderias.pdf?url";

export const denunciaTransporteSchema = buildDenunciaSchema({
  id: "denuncia-transporte",
  title: "Denuncia — Transporte de Mercaderías",
  shortDescription: "Reporte un siniestro ocurrido durante el transporte de mercaderías.",
  riesgoLabel: "riesgo/s asegurados",
  testigosLabel: "Nombre, teléfono, etc",
  templateAsset: transportePdf,
  coords: transporteCoords,
});
