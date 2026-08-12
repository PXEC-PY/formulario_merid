import { FormRunner } from "../../components/forms/FormRunner";
import { denunciaCristalesSchema } from "../../schemas/denunciaCristales.schema";

export function DenunciaCristalesPage() {
  return <FormRunner schema={denunciaCristalesSchema} />;
}
