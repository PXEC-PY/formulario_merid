import { FormRunner } from "../../components/forms/FormRunner";
import { denunciaIncendioSchema } from "../../schemas/denunciaIncendio.schema";

export function DenunciaIncendioPage() {
  return <FormRunner schema={denunciaIncendioSchema} />;
}
