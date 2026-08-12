import { ROLE_LABELS, type Role } from "../../types/roles";

const ROLE_STYLES: Record<Role, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  administrador: "bg-brand-100 text-brand-700",
  empleado: "bg-emerald-100 text-emerald-700",
  usuario: "bg-slate-100 text-slate-600",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}
