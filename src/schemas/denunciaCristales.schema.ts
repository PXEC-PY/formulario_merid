import { buildDenunciaSchema } from "./denunciaBase.schema";
import { cristalesCoords } from "./coordinates/cristales.coords";
import cristalesPdf from "../assets/templates/cristales.pdf?url";

export const denunciaCristalesSchema = buildDenunciaSchema({
  id: "denuncia-cristales",
  title: "Denuncia — Cristales, Vidrios y Espejos",
  shortDescription: "Reporte un siniestro de cristales, vidrios y espejos con todos sus detalles.",
  riesgoLabel: "riesgo/s asegurados",
  testigosLabel: "Nombre, teléfono, etc",
  templateAsset: cristalesPdf,
  coords: cristalesCoords,
  hasDanosATerceros: false,
});
