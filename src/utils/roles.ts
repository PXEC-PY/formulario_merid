import { ADMIN_ROLES, STAFF_ROLES, type Role } from "../types/roles";

export function canAccessForms(role: Role | undefined | null): boolean {
  return !!role && STAFF_ROLES.includes(role);
}

export function isAdminRole(role: Role | undefined | null): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}
