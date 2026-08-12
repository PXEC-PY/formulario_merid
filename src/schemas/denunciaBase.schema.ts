import type { FormSchema } from "../types/schema";
import type { DenunciaCoordinateMap } from "./coordinates/denunciaCoordinateMap";

export interface BuildDenunciaSchemaOptions {
  id: "denuncia-riesgos-varios" | "denuncia-transporte";
  title: string;
  shortDescription: string;
  riesgoLabel: string;
  testigosLabel: string;
  templateAsset: string;
  coords: DenunciaCoordinateMap;
}

const CIRCUNSTANCIAS_MAX_LENGTH = 1000;
const DANOS_MAX_LENGTH = 500;
const TESTIGOS_MAX_LENGTH = 400;

/** Riesgos Varios and Transporte de Mercaderías are ~95% the same form on the same
 * corporate letterhead — this factory is the single source of that shared field set.
 * Each caller only supplies the section subtitle, the 2 label words that differ, its own
 * template PDF and its own (separately calibrated) coordinate map. */
export function buildDenunciaSchema(opts: BuildDenunciaSchemaOptions): FormSchema {
  const { id, title, shortDescription, riesgoLabel, testigosLabel, templateAsset, coords: C } = opts;

  return {
    id,
    title,
    shortDescription,
    templateAsset,
    sections: [
      {
        id: "datos-asegurado",
        title: "Datos del Asegurado",
        fields: [
          {
            name: "asegurado",
            label: "Asegurado",
            type: "text",
            rules: [{ type: "required", message: "Ingrese el nombre del asegurado" }],
            pdf: C.asegurado,
          },
          {
            name: "ci",
            label: "C.I.",
            type: "text",
            rules: [{ type: "ci", message: "Ingrese un número de C.I. válido" }],
            pdf: C.ci,
          },
          { name: "ruc", label: "RUC", type: "text", rules: [{ type: "ruc", message: "Ingrese un RUC válido" }], pdf: C.ruc },
          {
            name: "domicilioParticular",
            label: "Domicilio Particular",
            type: "text",
            rules: [{ type: "required", message: "Ingrese el domicilio particular" }],
            pdf: C.domicilioParticular,
          },
          { name: "telefonoParticular", label: "Teléfono Particular", type: "phone", pdf: C.telefonoParticular },
          { name: "domicilioComercial", label: "Domicilio Comercial", type: "text", pdf: C.domicilioComercial },
          { name: "telefonoComercial", label: "Teléfono Comercial", type: "phone", pdf: C.telefonoComercial },
          {
            name: "correoElectronico",
            label: "Dirección de Correo electrónico",
            type: "email",
            rules: [
              { type: "required", message: "Ingrese un correo electrónico" },
              { type: "email", message: "Ingrese un correo electrónico válido" },
            ],
            pdf: C.correoElectronico,
          },
        ],
      },
      {
        id: "datos-siniestro",
        title: "Datos del Siniestro",
        fields: [
          {
            name: "lugarSiniestro",
            label: "Lugar del siniestro",
            type: "location",
            rules: [{ type: "required", message: "Ingrese el lugar del siniestro" }],
            pdf: C.lugarSiniestro,
          },
          {
            name: "fechaSiniestro",
            label: "Fecha del siniestro",
            type: "date",
            rules: [{ type: "required", message: "Ingrese la fecha del siniestro" }],
            pdf: C.fechaSiniestro,
          },
          {
            name: "horaSiniestro",
            label: "Hora del siniestro",
            type: "time",
            rules: [{ type: "required", message: "Ingrese la hora del siniestro" }],
            pdf: C.horaSiniestro,
          },
          {
            name: "circunstancias",
            label: `Circunstancias en que se produjo el siniestro y daños sufridos por el/los ${riesgoLabel} (si es necesario, agregue hojas complementarias)`,
            type: "textarea",
            maxLength: CIRCUNSTANCIAS_MAX_LENGTH,
            rules: [
              { type: "required", message: "Describa las circunstancias del siniestro" },
              { type: "maxLength", value: CIRCUNSTANCIAS_MAX_LENGTH, message: `Máximo ${CIRCUNSTANCIAS_MAX_LENGTH} caracteres` },
            ],
            pdf: C.circunstancias,
          },
        ],
      },
      {
        id: "danos",
        title: "Daños",
        fields: [
          {
            name: "danosATerceros",
            label: "¿Daños a terceros?",
            type: "radio-yesno",
            rules: [{ type: "required", message: "Seleccione una opción" }],
            pdf: C.danosATerceros,
          },
          {
            name: "breveDescripcionDanos",
            label: "Breve descripción de los daños materiales y/o personales",
            type: "textarea",
            maxLength: DANOS_MAX_LENGTH,
            rules: [{ type: "maxLength", value: DANOS_MAX_LENGTH, message: `Máximo ${DANOS_MAX_LENGTH} caracteres` }],
            pdf: C.breveDescripcionDanos,
          },
        ],
      },
      {
        id: "autoridad-policial",
        title: "Autoridad Policial",
        fields: [
          {
            name: "autoridadPolicial",
            label: "¿Intervino autoridad policial?",
            type: "radio-yesno",
            rules: [{ type: "required", message: "Seleccione una opción" }],
            pdf: C.autoridadPolicial,
          },
        ],
      },
      {
        id: "testigos",
        title: "Testigos",
        fields: [
          {
            name: "testigos",
            label: "¿Existen testigos?",
            type: "radio-yesno",
            rules: [{ type: "required", message: "Seleccione una opción" }],
            pdf: C.testigos,
          },
          {
            name: "datosTestigos",
            label: `Datos del/los Testigo/s (${testigosLabel})`,
            type: "textarea",
            maxLength: TESTIGOS_MAX_LENGTH,
            showIf: { field: "testigos", equals: true },
            rules: [
              { type: "required", message: "Ingrese los datos de los testigos" },
              { type: "maxLength", value: TESTIGOS_MAX_LENGTH, message: `Máximo ${TESTIGOS_MAX_LENGTH} caracteres` },
            ],
            pdf: C.datosTestigos,
          },
        ],
      },
      {
        id: "firma",
        title: "Firma",
        fields: [
          {
            name: "fechaDenuncia",
            label: "Fecha de denuncia",
            type: "date",
            rules: [{ type: "required", message: "Ingrese la fecha de denuncia" }],
            pdf: C.fechaDenuncia,
          },
          {
            name: "firma",
            label: "Firma del Asegurado o persona autorizada",
            type: "signature",
            // Optional on purpose: the user may prefer to print the PDF and sign on
            // paper, or open it in Adobe to apply a certified digital signature instead.
            pdf: C.firma,
          },
        ],
      },
    ],
    internalUseSection: {
      title: "USO INTERNO",
      rows: [], // staff-only, filled outside this app for now — see FormSchema.internalUseSection
    },
  };
}
