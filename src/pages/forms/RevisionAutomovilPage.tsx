import { FormRunner } from "../../components/forms/FormRunner";
import { revisionAutomovilSchema } from "../../schemas/revisionAutomovil.schema";

export function RevisionAutomovilPage() {
  return <FormRunner schema={revisionAutomovilSchema} />;
}
