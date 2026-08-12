import { FormRunner } from "../../components/forms/FormRunner";
import { denunciaRoboSchema } from "../../schemas/denunciaRobo.schema";

export function DenunciaRoboPage() {
  return <FormRunner schema={denunciaRoboSchema} />;
}
