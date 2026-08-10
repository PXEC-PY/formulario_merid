import type { FormSchema } from "../types/schema";
import { automovilCoords as C } from "./coordinates/automovil.coords";
import denunciaAutomovilPdf from "../assets/templates/denuncia-automovil.pdf?url";

const DANOS_MAX_LENGTH = 200;

export const denunciaAutomovilSchema: FormSchema = {
  id: "denuncia-automovil",
  title: "Denuncia — Automóviles y Ocupantes",
  shortDescription: "Reporte un siniestro de automóvil, con los datos de ambos vehículos y su ubicación en el mapa.",
  templateAsset: denunciaAutomovilPdf,
  pdfStrategy: "acroform",
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
          acroField: "Asegurado",
          acroMaxWidth: 376,
        },
        {
          name: "ci",
          label: "C.I.",
          type: "text",
          rules: [
            { type: "required", message: "Ingrese el número de C.I." },
            { type: "ci", message: "Ingrese un número de C.I. válido" },
          ],
          acroField: "CI",
          acroMaxWidth: 72,
        },
        { name: "ruc", label: "RUC", type: "text", rules: [{ type: "ruc", message: "Ingrese un RUC válido" }], acroField: "RUC", acroMaxWidth: 298 },
        {
          name: "domicilioParticular",
          label: "Domicilio Particular",
          type: "text",
          rules: [{ type: "required", message: "Ingrese el domicilio particular" }],
          acroField: "DomicilioParticular",
          acroMaxWidth: 204,
        },
        { name: "telefonoParticular", label: "Teléfono Particular", type: "phone", acroField: "TelParticular", acroMaxWidth: 88 },
        { name: "domicilioComercial", label: "Domicilio Comercial", type: "text", acroField: "DomicilioComercial", acroMaxWidth: 205 },
        { name: "telefonoComercial", label: "Teléfono Comercial", type: "phone", acroField: "TelComercial", acroMaxWidth: 88 },
        {
          name: "correoElectronico",
          label: "Dirección de Correo electrónico",
          type: "email",
          rules: [
            { type: "required", message: "Ingrese un correo electrónico" },
            { type: "email", message: "Ingrese un correo electrónico válido" },
          ],
          acroField: "CorreoElectronico",
          acroMaxWidth: 269,
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
          acroField: "LugarSiniestro",
          acroMaxWidth: 335,
          pdf: C.lugarSiniestroMap,
        },
        {
          name: "fechaSiniestro",
          label: "Fecha del siniestro",
          type: "date",
          rules: [{ type: "required", message: "Ingrese la fecha del siniestro" }],
          acroField: "FechaSiniestro",
          acroMaxWidth: 140,
        },
        {
          name: "horaSiniestro",
          label: "Hora del siniestro",
          type: "time",
          rules: [{ type: "required", message: "Ingrese la hora del siniestro" }],
          acroField: "HoraSiniestro",
          acroMaxWidth: 91,
        },
        {
          name: "circunstancias",
          label: "Circunstancias en que se produjo (si es necesario, agregue hojas complementarias)",
          type: "textarea",
          maxLength: 500,
          rules: [{ type: "required", message: "Describa las circunstancias del siniestro" }],
          acroField: "Circunstancias",
          acroMaxWidth: 435,
          acroMultiline: true,
        },
      ],
    },
    {
      id: "vehiculo-asegurado",
      title: "Datos del Vehículo Asegurado",
      fields: [
        { name: "vaTipo", label: "Tipo", type: "text", acroField: "VA_Tipo", acroMaxWidth: 60 },
        { name: "vaMarca", label: "Marca", type: "text", acroField: "VA_Marca", acroMaxWidth: 78 },
        { name: "vaModelo", label: "Modelo", type: "text", acroField: "VA_Modelo", acroMaxWidth: 40 },
        { name: "vaAnio", label: "Año", type: "text", acroField: "VA_Anio", acroMaxWidth: 97 },
        { name: "vaPatente", label: "Patente", type: "text", acroField: "VA_Patente", acroMaxWidth: 171 },
        { name: "vaMotor", label: "Motor", type: "text", acroField: "VA_Motor", acroMaxWidth: 177 },
        { name: "vaChasis", label: "Chasis", type: "text", acroField: "VA_Chasis", acroMaxWidth: 176 },
        { name: "vaConductor", label: "Conductor", type: "text", acroField: "VA_Conductor", acroMaxWidth: 155 },
        { name: "vaRegistroN", label: "Registro N°", type: "text", acroField: "VA_RegistroN", acroMaxWidth: 150 },
        { name: "vaExpedidoPor", label: "Expedido por", type: "text", acroField: "VA_ExpedidoPor", acroMaxWidth: 140 },
        {
          name: "vaDanios",
          label: "Daños sufridos por el vehículo asegurado",
          type: "textarea",
          maxLength: DANOS_MAX_LENGTH,
          acroFields: ["VA_Danios1", "VA_Danios2", "VA_Danios3"],
          acroMaxWidth: 220,
        },
      ],
    },
    {
      id: "otro-vehiculo",
      title: "Datos del Otro Vehículo",
      fields: [
        { name: "ovTipo", label: "Tipo", type: "text", acroField: "OV_Tipo", acroMaxWidth: 46 },
        { name: "ovMarca", label: "Marca", type: "text", acroField: "OV_Marca", acroMaxWidth: 93 },
        { name: "ovModelo", label: "Modelo", type: "text", acroField: "OV_Modelo", acroMaxWidth: 30 },
        { name: "ovAnio", label: "Año", type: "text", acroField: "OV_Anio", acroMaxWidth: 106 },
        { name: "ovPatente", label: "Patente", type: "text", acroField: "OV_Patente", acroMaxWidth: 172 },
        { name: "ovPropietario", label: "Propietario", type: "text", acroField: "OV_Propietario", acroMaxWidth: 152 },
        { name: "ovDomicilio", label: "Domicilio", type: "text", acroField: "OV_Domicilio", acroMaxWidth: 161 },
        { name: "ovTelefonos", label: "Teléfonos", type: "phone", acroField: "OV_Telefonos", acroMaxWidth: 165 },
        { name: "ovConductor", label: "Conductor", type: "text", acroField: "OV_Conductor", acroMaxWidth: 159 },
        { name: "ovRegistroN", label: "Registro N°", type: "text", acroField: "OV_RegistroN", acroMaxWidth: 151 },
        {
          name: "ovDanios",
          label: "Daños sufridos por el otro vehículo",
          type: "textarea",
          maxLength: DANOS_MAX_LENGTH,
          acroFields: ["OV_Danios1", "OV_Danios2", "OV_Danios3"],
          acroMaxWidth: 223,
        },
      ],
    },
    {
      id: "autoridad-testigos",
      title: "Autoridad Policial y Testigos",
      fields: [
        { name: "autoridadPolicial", label: "Autoridad Policial Interviniente", type: "text", acroField: "AutoridadPolicial", acroMaxWidth: 270 },
        { name: "daniosLesiones", label: "Daños y/o lesiones personales", type: "text", acroField: "DaniosLesiones", acroMaxWidth: 283 },
        { name: "citarTestigos", label: "Citar Testigos", type: "text", acroField: "CitarTestigos", acroMaxWidth: 361 },
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
          acroField: "FechaDenuncia",
          acroMaxWidth: 338,
        },
        {
          name: "firma",
          label: "Firma del Asegurado o persona autorizada",
          type: "signature",
          // Optional on purpose: the user may prefer to print the PDF and sign on paper,
          // or open it in Adobe to apply a certified digital signature instead.
          pdf: C.firma,
        },
      ],
    },
  ],
};
