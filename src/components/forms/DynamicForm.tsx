import type { SectionSchema } from "../../types/schema";
import type { FormData } from "../../types/formData";
import { FieldRenderer } from "./FieldRenderer";

interface DynamicFormProps {
  section: SectionSchema;
  data: FormData;
  errors: Record<string, string>;
  onFieldChange: (name: string, value: unknown) => void;
}

/** Renders one section of any FormSchema. Nothing here knows which of the 3 forms it's
 * rendering — that's the point of the schema-driven design. */
export function DynamicForm({ section, data, errors, onFieldChange }: DynamicFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
      {section.fields.map((field) => (
        <FieldRenderer key={field.name} field={field} data={data} errors={errors} onFieldChange={onFieldChange} />
      ))}
    </div>
  );
}
