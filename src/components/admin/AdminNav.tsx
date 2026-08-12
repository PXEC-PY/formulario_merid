import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/admin/usuarios", label: "Usuarios" },
  { to: "/admin/departamentos", label: "Departamentos" },
  { to: "/admin/descargas", label: "Descargas" },
];

export function AdminNav() {
  return (
    <nav className="flex gap-4 border-b border-slate-200 text-sm font-medium">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `-mb-px border-b-2 px-1 py-2 ${isActive ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-700"}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
