import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../types/roles";

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="px-4 py-12 text-center text-sm text-slate-500">Cargando...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!profile || !roles.includes(profile.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
