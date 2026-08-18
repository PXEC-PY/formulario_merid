import type { FieldSchema } from "../../types/schema";
import type { ChecklistMatrixValue, ChecklistTableValue, FormData, LocationValue } from "../../types/formData";
import type { HandwrittenSignature } from "../../types/signature";
import type { Photo } from "../../types/photo";
import { isFieldVisible } from "../../utils/fieldVisibility";
import { TextField } from "../fields/TextField";
import { CharCounterTextArea } from "../fields/CharCounterTextArea";
import { DateField } from "../fields/DateField";
import { TimeField } from "../fields/TimeField";
import { RadioYesNo } from "../fields/RadioYesNo";
import { SelectField } from "../fields/SelectField";
import { LocationField } from "../fields/LocationField";
import { StaticLegalText } from "../fields/StaticLegalText";
import { ChecklistTableField } from "../fields/ChecklistTableField";
import { ChecklistMatrixField } from "../fields/ChecklistMatrixField";
import { PhotoField } from "../fields/PhotoField";
import { SignaturePad } from "../signature/SignaturePad";

interface FieldRendererProps {
  field: FieldSchema;
  data: FormData;
  errors: Record<string, string>;
  onFieldChange: (name: string, value: unknown) => void;
}

export function FieldRenderer({ field, data, errors, onFieldChange }: FieldRendererProps) {
  if (!isFieldVisible(field, data)) return null;

  const value = data[field.name];
  const error = errors[field.name];
  const onChange = (v: unknown) => onFieldChange(field.name, v);

  switch (field.type) {
    case "text":
    case "email":
    case "phone":
      return <TextField field={field} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "textarea":
      return <CharCounterTextArea field={field} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "date":
      return <DateField field={field} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "time":
      return <TimeField field={field} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "radio-yesno":
      return <RadioYesNo field={field} value={value as boolean | undefined} onChange={onChange} error={error} />;
    case "select":
      return <SelectField field={field} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "location":
      return <LocationField field={field} value={value as LocationValue | undefined} onChange={onChange} error={error} />;
    case "signature":
      return (
        <SignaturePad field={field} value={value as HandwrittenSignature | undefined} onChange={onChange} error={error} />
      );
    case "static-legal-text":
      return <StaticLegalText field={field} />;
    case "checklist-table":
      return (
        <ChecklistTableField field={field} value={value as ChecklistTableValue | undefined} onChange={onChange} error={error} />
      );
    case "checklist-matrix":
      return (
        <ChecklistMatrixField field={field} value={value as ChecklistMatrixValue | undefined} onChange={onChange} error={error} />
      );
    case "photo":
      return <PhotoField field={field} value={(value as Photo[]) ?? []} onChange={onChange} error={error} />;
    default:
      return null;
  }
}
