import { buildDenunciaSchema } from "./denunciaBase.schema";
import { roboCoords } from "./coordinates/robo.coords";
import roboPdf from "../assets/templates/robo.pdf?url";

export const denunciaRoboSchema = buildDenunciaSchema({
  id: "denuncia-robo",
  title: "Denuncia — Robo y Riesgos Similares",
  shortDescription: "Reporte un siniestro de robo y riesgos similares con todos sus detalles.",
  riesgoLabel: "riesgo/s asegurados",
  circunstanciasLabel:
    "Circunstancias en que se produjo el siniestro, detalle de bienes sustraídos y daños sufridos por la propiedad (si es necesario, agregue hojas complementarias)",
  testigosLabel: "Nombre, teléfono, etc",
  templateAsset: roboPdf,
  coords: roboCoords,
});
