import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAdminRole } from "../utils/roles";

interface FormCardInfo {
  to: string;
  icon: string;
  title: string;
  description: string;
}

const FORM_CARDS: FormCardInfo[] = [
  {
    to: "/personas-fisicas",
    icon: "🪪",
    title: "Identificación de Personas Físicas",
    description: "Complete sus datos personales, laborales y declaración jurada.",
  },
  {
    to: "/denuncia/riesgos-varios",
    icon: "⚠️",
    title: "Denuncia — Riesgos Varios",
    description: "Reporte un siniestro de riesgos varios con todos sus detalles.",
  },
  {
    to: "/denuncia/incendio",
    icon: "🔥",
    title: "Denuncia — Incendio y Aliados",
    description: "Reporte un siniestro de incendio y riesgos aliados con todos sus detalles.",
  },
  {
    to: "/denuncia/cristales",
    icon: "🪟",
    title: "Denuncia — Cristales, Vidrios y Espejos",
    description: "Reporte un siniestro de cristales, vidrios y espejos con todos sus detalles.",
  },
  {
    to: "/denuncia/robo",
    icon: "🕵️",
    title: "Denuncia — Robo y Riesgos Similares",
    description: "Reporte un siniestro de robo y riesgos similares con todos sus detalles.",
  },
  {
    to: "/denuncia/transporte",
    icon: "🚚",
    title: "Denuncia — Transporte de Mercaderías",
    description: "Reporte un siniestro ocurrido durante el transporte de mercaderías.",
  },
  {
    to: "/denuncia/automovil",
    icon: "🚗",
    title: "Denuncia — Automóviles y Ocupantes",
    description: "Reporte un siniestro de automóvil, con los datos de ambos vehículos y el lugar en el mapa.",
  },
  {
    to: "/revision-automovil",
    icon: "🔍",
    title: "Inspección de Riesgo - Sección Automóviles",
    description: "Inspeccione el estado del vehículo del asegurado con checklist de condición general y fotos.",
  },
];

export function Home() {
  const { profile } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Formularios Digitales</h1>
        <p className="mt-2 text-slate-600">Elegí el formulario que necesitás completar.</p>
      </div>

      {isAdminRole(profile?.role) && (
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Administración</h2>
            <p className="mt-1 text-sm text-slate-600">Gestioná usuarios, roles, departamentos y descargas.</p>
          </div>
          <Link
            to="/admin/usuarios"
            className="flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Ir al panel
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FORM_CARDS.map((card) => (
          <div
            key={card.to}
            className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-2xl">
                {card.icon}
              </div>
              <h2 className="text-base font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-1.5 text-sm text-slate-600">{card.description}</p>
            </div>
            <Link
              to={card.to}
              className="flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Completar formulario
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
