import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { createDepartment, deleteDepartment, listDepartments, renameDepartment } from "../../hooks/useAdmin";
import type { Department } from "../../types/roles";
import { baseInputClasses } from "../../components/fields/FieldWrapper";

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error: loadError } = await listDepartments();
    setDepartments(data);
    setError(loadError);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const { error: createError } = await createDepartment(newName.trim());
    if (createError) {
      setError(createError);
      return;
    }
    setNewName("");
    setError(null);
    load();
  };

  const startEditing = (dept: Department) => {
    setEditingId(dept.id);
    setEditingName(dept.name);
  };

  const handleRename = async (id: string) => {
    if (!editingName.trim()) return;
    const { error: renameError } = await renameDepartment(id, editingName.trim());
    if (renameError) {
      setError(renameError);
      return;
    }
    setEditingId(null);
    setError(null);
    load();
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await deleteDepartment(id);
    if (deleteError) {
      setError(deleteError);
      return;
    }
    load();
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Departamentos</h1>
        <Link to="/admin/usuarios" className="text-sm text-brand-700 hover:underline">
          ← Volver a usuarios
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">✗ {error}</p>}

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          className={baseInputClasses}
          placeholder="Nombre del departamento"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Agregar
        </button>
      </form>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Cargando...</p>
        ) : departments.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">Todavía no hay departamentos.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {departments.map((dept) => (
              <li key={dept.id} className="flex items-center justify-between gap-3 px-4 py-3">
                {editingId === dept.id ? (
                  <input
                    className={`${baseInputClasses} min-h-9 py-1.5`}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm text-slate-800">{dept.name}</span>
                )}
                <div className="flex shrink-0 gap-3 text-sm">
                  {editingId === dept.id ? (
                    <button type="button" onClick={() => handleRename(dept.id)} className="text-brand-700 hover:underline">
                      Guardar
                    </button>
                  ) : (
                    <button type="button" onClick={() => startEditing(dept)} className="text-slate-600 hover:underline">
                      Renombrar
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(dept.id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
