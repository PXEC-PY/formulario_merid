import { FormRunner } from "../../components/forms/FormRunner";
import { denunciaRiesgosVariosSchema } from "../../schemas/denunciaRiesgosVarios.schema";

export function DenunciaRiesgosVariosPage() {
  return <FormRunner schema={denunciaRiesgosVariosSchema} />;
}
