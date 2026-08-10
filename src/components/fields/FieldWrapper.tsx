import type { ReactNode } from "react";

interface FieldWrapperProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, required, hint, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-brand-600">*</span>}
      </label>
      {children}
      <div className="flex items-center justify-between gap-2 min-h-[1.1rem]">
        {error ? (
          <p className="flex items-center gap-1 text-sm text-red-600">
            <span aria-hidden>✗</span> {error}
          </p>
        ) : (
          <span />
        )}
        {hint}
      </div>
    </div>
  );
}

export const baseInputClasses =
  "w-full rounded-lg border px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 min-h-11";

export function inputBorderClass(hasError: boolean, hasValue: boolean) {
  if (hasError) return "border-red-400 bg-red-50/40";
  if (hasValue) return "border-brand-300 bg-white";
  return "border-slate-300 bg-white";
}
