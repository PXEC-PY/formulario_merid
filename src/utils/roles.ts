import { ADMIN_ROLES, type Role } from "../types/roles";

export function isAdminRole(role: Role | undefined | null): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}
