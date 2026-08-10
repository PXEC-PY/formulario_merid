export interface DateParts {
  day: string;
  month: string;
  year: string;
}

/** `<input type="date">` always yields "YYYY-MM-DD" — split it for the templates that
 * print separate day/month/year boxes (the two denuncia forms). */
export function splitIsoDate(iso: string): DateParts | null {
  if (!iso) return null;
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return null;
  return { day, month, year };
}

export function formatIsoDateToDisplay(iso: string): string {
  const parts = splitIsoDate(iso);
  return parts ? `${parts.day}/${parts.month}/${parts.year}` : "";
}

export interface TimeParts {
  hour: string;
  minute: string;
}

export function splitTime(value: string): TimeParts | null {
  if (!value) return null;
  const [hour, minute] = value.split(":");
  if (!hour || !minute) return null;
  return { hour, minute };
}
