import { useEffect, useState } from "react";
import { listDownloadLog, type DownloadLogRow } from "../../hooks/useAdmin";
import { AdminNav } from "../../components/admin/AdminNav";
import { countryFlagEmoji } from "../../utils/countryFlag";

const KIND_LABELS: Record<DownloadLogRow["kind"], string> = {
  pdf: "PDF",
  photos_zip: "Fotos (.zip)",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-PY", { dateStyle: "short", timeStyle: "short" });
}

export function DownloadsPage() {
  const [rows, setRows] = useState<DownloadLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listDownloadLog().then((result) => {
      setRows(result.data);
      setError(result.error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Administración</h1>
      <AdminNav />

      {error && <p className="text-sm text-red-600">✗ {error}</p>}

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Cargando...</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">Todavía no hay descargas registradas.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Formulario</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">País</th>
                <th className="px-4 py-3">Dispositivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-800">{row.userLabel}</td>
                  <td className="px-4 py-3 text-slate-600">{row.formId}</td>
                  <td className="px-4 py-3 text-slate-600">{KIND_LABELS[row.kind]}</td>
                  <td className="px-4 py-3 text-slate-600">{row.ip ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.countryCode ? (
                      <span>
                        {countryFlagEmoji(row.countryCode)} {row.countryName}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500" title={row.userAgent ?? ""}>
                    {row.userAgent ?? "—"}
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
