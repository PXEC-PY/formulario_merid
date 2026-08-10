import { buildDenunciaSchema } from "./denunciaBase.schema";
import { riesgosVariosCoords } from "./coordinates/riesgosVarios.coords";
import riesgosVariosPdf from "../assets/templates/riesgos-varios.pdf?url";

export const denunciaRiesgosVariosSchema = buildDenunciaSchema({
  id: "denuncia-riesgos-varios",
  title: "Denuncia — Riesgos Varios",
  shortDescription: "Reporte un siniestro de riesgos varios con todos sus detalles.",
  riesgoLabel: "riesgo/s asegurado/s",
  testigosLabel: "Nombres, teléfonos, etc",
  templateAsset: riesgosVariosPdf,
  coords: riesgosVariosCoords,
});
