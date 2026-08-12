import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listDepartments,
  listProfiles,
  updateUserDepartment,
  updateUserRole,
  type AdminProfileRow,
} from "../../hooks/useAdmin";
import { RoleBadge } from "../../components/admin/RoleBadge";
import { ASSIGNABLE_ROLES, ROLE_LABELS, type Department, type Role } from "../../types/roles";
import { baseInputClasses } from "../../components/fields/FieldWrapper";

export function UsersPage() {
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [profilesResult, departmentsResult] = await Promise.all([listProfiles(), listDepartments()]);
    setProfiles(profilesResult.data);
    setDepartments(departmentsResult.data);
    setError(profilesResult.error ?? departmentsResult.error);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (userId: string, role: Role) => {
    setSavingId(userId);
    const { error: updateError } = await updateUserRole(userId, role);
    if (updateError) {
      setError(updateError);
    } else {
      setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, role } : p)));
    }
    setSavingId(null);
  };

  const handleDepartmentChange = async (userId: string, departmentId: string) => {
    setSavingId(userId);
    const { error: updateError } = await updateUserDepartment(userId, departmentId || null);
    if (updateError) {
      setError(updateError);
    } else {
      setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, departmentId: departmentId || null } : p)));
    }
    setSavingId(null);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
        <Link to="/admin/departamentos" className="text-sm text-brand-700 hover:underline">
          Gestionar departamentos →
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">✗ {error}</p>}

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Cargando...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Departamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-slate-800">
                    {[p.firstName, p.lastName].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.role === "super_admin" ? (
                      <RoleBadge role={p.role} />
                    ) : (
                      <select
                        className={`${baseInputClasses} min-h-9 py-1.5`}
                        value={p.role}
                        disabled={savingId === p.id}
                        onChange={(e) => handleRoleChange(p.id, e.target.value as Role)}
                      >
                        {ASSIGNABLE_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className={`${baseInputClasses} min-h-9 py-1.5`}
                      value={p.departmentId ?? ""}
                      disabled={savingId === p.id}
                      onChange={(e) => handleDepartmentChange(p.id, e.target.value)}
                    >
                      <option value="">Sin departamento</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
