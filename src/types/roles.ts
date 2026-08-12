export type Role = "super_admin" | "administrador" | "empleado" | "usuario";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  administrador: "Administrador",
  empleado: "Empleado",
  usuario: "Usuario",
};

/** Roles asignables desde el panel de administración — Super Admin queda deliberadamente
 * afuera, se asigna una única vez a mano directamente en la base de datos. */
export const ASSIGNABLE_ROLES: Role[] = ["administrador", "empleado", "usuario"];

/** Roles que pueden ver y completar los 5 formularios. */
export const STAFF_ROLES: Role[] = ["super_admin", "administrador", "empleado"];

/** Roles con acceso al panel de administración (usuarios/departamentos). */
export const ADMIN_ROLES: Role[] = ["super_admin", "administrador"];

export interface Department {
  id: string;
  name: string;
  createdAt: string;
}
