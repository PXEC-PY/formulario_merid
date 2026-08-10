import { FormRunner } from "../../components/forms/FormRunner";
import { personasFisicasSchema } from "../../schemas/personasFisicas.schema";

export function PersonasFisicasPage() {
  return <FormRunner schema={personasFisicasSchema} />;
}
