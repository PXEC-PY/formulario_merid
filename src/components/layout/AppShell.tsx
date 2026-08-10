import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logoMeridional from "../../assets/logo-meridional.png";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/">
            <img src={logoMeridional} alt="La Meridional Paraguaya S.A. de Seguros" className="h-12 w-auto" />
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Formularios Digitales — La Meridional Paraguaya S.A. de Seguros
      </footer>
    </div>
  );
}
