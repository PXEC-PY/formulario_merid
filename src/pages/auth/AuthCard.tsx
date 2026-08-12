import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Shared centered-card shell for the login/signup/forgot-password/reset-password
 * screens — keeps their layout consistent without duplicating the wrapper markup. */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
    </div>
  );
}
