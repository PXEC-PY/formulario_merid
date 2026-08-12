import { buildDenunciaSchema } from "./denunciaBase.schema";
import { incendioAliadosCoords } from "./coordinates/incendioAliados.coords";
import incendioAliadosPdf from "../assets/templates/incendio-aliados.pdf?url";

export const denunciaIncendioSchema = buildDenunciaSchema({
  id: "denuncia-incendio",
  title: "Denuncia — Incendio y Aliados",
  shortDescription: "Reporte un siniestro de incendio y riesgos aliados con todos sus detalles.",
  riesgoLabel: "riesgo/s asegurado/s",
  testigosLabel: "Nombres, teléfonos, etc",
  templateAsset: incendioAliadosPdf,
  coords: incendioAliadosCoords,
});
