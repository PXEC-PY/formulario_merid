import { z } from "zod";

// Paraguayan C.I. (cédula de identidad): digits only, 5 to 8 digits once separators are
// stripped (e.g. "4.123.456", "4,123,456" or "4123456"). Kept intentionally permissive —
// this is a citizen-facing form, not a validity check against the Registro Civil. Both "."
// and "," are accepted as thousand separators since users mix them up.
export const ciSchema = z
  .string()
  .transform((v) => v.replace(/[.,\s]/g, ""))
  .pipe(z.string().regex(/^\d{5,9}$/, "Ingrese un número de C.I. válido"));

// Paraguayan RUC: digits (optionally grouped with "." or "," as thousand separators),
// optional hyphen and one check digit (e.g. "80012345-6" or "1.225.666-2").
export const rucSchema = z
  .string()
  .transform((v) => v.replace(/[.,\s]/g, ""))
  .pipe(z.string().regex(/^\d{4,9}-?\d$/, "Ingrese un RUC válido (ej: 80012345-6)"));

export const emailSchema = z.string().email("Ingrese un correo electrónico válido");

// Accepts local Paraguayan formats loosely: optional +595, spaces, hyphens, parentheses.
export const phoneSchema = z
  .string()
  .regex(/^[0-9+()\-\s]{6,20}$/, "Ingrese un teléfono válido");

export function isValidCi(value: string): boolean {
  return ciSchema.safeParse(value).success;
}

export function isValidRuc(value: string): boolean {
  return rucSchema.safeParse(value).success;
}

export function isValidEmail(value: string): boolean {
  return emailSchema.safeParse(value).success;
}

export function isValidPhone(value: string): boolean {
  return phoneSchema.safeParse(value).success;
}
