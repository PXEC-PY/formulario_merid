import { FormRunner } from "../../components/forms/FormRunner";
import { denunciaTransporteSchema } from "../../schemas/denunciaTransporte.schema";

export function DenunciaTransportePage() {
  return <FormRunner schema={denunciaTransporteSchema} />;
}
