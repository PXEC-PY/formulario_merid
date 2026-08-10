import { FormRunner } from "../../components/forms/FormRunner";
import { denunciaAutomovilSchema } from "../../schemas/denunciaAutomovil.schema";

export function DenunciaAutomovilPage() {
  return <FormRunner schema={denunciaAutomovilSchema} />;
}
