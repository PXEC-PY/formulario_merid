import type { FormSchema, SelectOption } from "../types/schema";

const BUENO_REGULAR_MALO_OPTIONS: SelectOption[] = [
  { value: "bueno", label: "Bueno" },
  { value: "regular", label: "Regular" },
  { value: "malo", label: "Malo" },
];

const SI_NO_OPTIONS: SelectOption[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export const revisionAutomovilSchema: FormSchema = {
  id: "revision-automovil",
  title: "Revisión de Automóvil del Asegurado",
  shortDescription: "Inspeccione el estado del vehículo del asegurado, con checklist de condición general y fotos.",
  pdfStrategy: "generated",
  sections: [
    {
      id: "datos-asegurado",
      title: "Datos del Asegurado",
      fields: [
        { name: "nombreAsegurado", label: "Nombre del Asegurado", type: "text", rules: [{ type: "required", message: "Ingrese el nombre del asegurado" }] },
        { name: "documentoIdentidad", label: "Documento de Identidad", type: "text", rules: [{ type: "required", message: "Ingrese el documento de identidad" }] },
        { name: "direccion", label: "Dirección", type: "text" },
        { name: "telefono", label: "Teléfono / Celular", type: "phone" },
        { name: "correoElectronico", label: "Correo Electrónico", type: "email", rules: [{ type: "email", message: "Ingrese un correo electrónico válido" }] },
        { name: "nroPoliza", label: "N° de Póliza", type: "text", rules: [{ type: "required", message: "Ingrese el número de póliza" }] },
        { name: "vigenciaDesde", label: "Vigencia de la Póliza — Desde", type: "date", layoutWidth: "half" },
        { name: "vigenciaHasta", label: "Vigencia de la Póliza — Hasta", type: "date", layoutWidth: "half" },
        { name: "aseguradora", label: "Aseguradora", type: "text" },
      ],
    },
    {
      id: "datos-vehiculo",
      title: "Datos del Vehículo",
      fields: [
        { name: "marca", label: "Marca", type: "text", layoutWidth: "half", rules: [{ type: "required", message: "Ingrese la marca" }] },
        { name: "modelo", label: "Modelo", type: "text", layoutWidth: "half" },
        { name: "anio", label: "Año", type: "text", layoutWidth: "half" },
        { name: "color", label: "Color", type: "text", layoutWidth: "half" },
        { name: "tipoVehiculo", label: "Tipo de Vehículo", type: "text", layoutWidth: "half" },
        { name: "matricula", label: "Matrícula / Chapa", type: "text", layoutWidth: "half" },
        { name: "vin", label: "N° de Chasis (VIN)", type: "text" },
        { name: "nroMotor", label: "N° de Motor", type: "text" },
        { name: "kilometraje", label: "Kilometraje Actual (km)", type: "text", layoutWidth: "half" },
        {
          name: "usoVehiculo",
          label: "Uso del Vehículo",
          type: "select",
          layoutWidth: "half",
          options: [
            { value: "particular", label: "Particular" },
            { value: "comercial", label: "Comercial" },
            { value: "otro", label: "Otro" },
          ],
        },
      ],
    },
    {
      id: "carroceria-exterior",
      title: "3.1 Carrocería y Exterior",
      fields: [
        {
          name: "checklistCarroceria",
          label: "Carrocería y Exterior",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "parachoquesDelantero", label: "Parachoques delantero" },
            { key: "parachoquesTrasero", label: "Parachoques trasero" },
            { key: "capo", label: "Capó" },
            { key: "guardabarros", label: "Guardabarros" },
            { key: "puertas", label: "Puertas" },
            { key: "techo", label: "Techo" },
            { key: "maleteroPorton", label: "Maletero / Portón" },
            { key: "lunasVidrios", label: "Lunas / Vidrios" },
            { key: "faros", label: "Faros" },
            { key: "lucesTraseras", label: "Luces traseras" },
            { key: "espejosLaterales", label: "Espejos laterales" },
            { key: "llantasRines", label: "Llantas / Rines" },
            { key: "otrosCarroceria", label: "Otros" },
          ],
        },
      ],
    },
    {
      id: "interior",
      title: "3.2 Interior",
      fields: [
        {
          name: "checklistInterior",
          label: "Interior",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "tapiceriaAsientos", label: "Tapicería / Asientos" },
            { key: "tablero", label: "Tablero" },
            { key: "volante", label: "Volante" },
            { key: "cinturonesSeguridad", label: "Cinturones de seguridad" },
            { key: "aireAcondicionadoInterior", label: "Aire acondicionado" },
            { key: "sistemaElectricoInterior", label: "Sistema eléctrico" },
            { key: "sistemaSonido", label: "Sistema de sonido" },
            { key: "instrumentos", label: "Instrumentos" },
            { key: "otrosInterior", label: "Otros" },
          ],
        },
      ],
    },
    {
      id: "documentos-vehiculo",
      title: "3.3 Documentos del Vehículo",
      fields: [
        {
          name: "checklistDocumentos",
          label: "Documentos del Vehículo",
          type: "checklist-table",
          options: SI_NO_OPTIONS,
          tableRows: [
            { key: "cedulaVerde", label: "Cédula Verde" },
            { key: "habilitacionMunicipal", label: "Habilitación Municipal" },
            { key: "revisionTecnica", label: "Revisión Técnica / ITV" },
            { key: "seguroObligatorio", label: "Seguro Obligatorio (SOAT)" },
            { key: "manualPropietario", label: "Manual del Propietario" },
            { key: "otrosDocumentos", label: "Otros" },
          ],
        },
      ],
    },
    {
      id: "mecanica-funcionamiento",
      title: "3.4 Mecánica y Funcionamiento",
      fields: [
        {
          name: "checklistMecanica",
          label: "Mecánica y Funcionamiento",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "motor", label: "Motor" },
            { key: "transmision", label: "Transmisión" },
            { key: "frenos", label: "Frenos" },
            { key: "suspension", label: "Suspensión" },
            { key: "direccion", label: "Dirección" },
            { key: "sistemaEscape", label: "Sistema de escape" },
            { key: "sistemaElectricoMecanica", label: "Sistema eléctrico" },
            { key: "bateria", label: "Batería" },
            { key: "aireAcondicionadoMecanica", label: "Aire acondicionado" },
            { key: "fugasFluidos", label: "Fugas de fluidos" },
            { key: "otrosMecanica", label: "Otros" },
          ],
        },
      ],
    },
    {
      id: "accesorios-equipamiento",
      title: "3.5 Accesorios y Equipamiento",
      fields: [
        {
          name: "checklistAccesorios",
          label: "Accesorios y Equipamiento",
          type: "checklist-table",
          options: SI_NO_OPTIONS,
          tableRows: [
            { key: "llantaRepuesto", label: "Llanta de repuesto" },
            { key: "gato", label: "Gato" },
            { key: "herramientasBasicas", label: "Herramientas básicas" },
            { key: "extintor", label: "Extintor" },
            { key: "trianguloSeguridad", label: "Triángulo de seguridad" },
            { key: "botiquin", label: "Botiquín" },
            { key: "otrosAccesorios", label: "Otros" },
          ],
        },
      ],
    },
    {
      id: "observaciones-generales",
      title: "3.6 Observaciones Generales",
      fields: [
        { name: "observacionesGenerales", label: "Observaciones Generales", type: "textarea", maxLength: 600 },
      ],
    },
    {
      id: "declaracion-asegurado",
      title: "Declaración del Asegurado",
      fields: [
        {
          name: "textoDeclaracionAsegurado",
          label: "Declaración",
          type: "static-legal-text",
          staticText:
            "Declaro que los datos proporcionados y las condiciones del vehículo consignadas en este formulario son verídicos y autorizo a la aseguradora a realizar las verificaciones que considere necesarias.",
        },
        { name: "aclaracionFirmaAsegurado", label: "Aclaración de Firma", type: "text", layoutWidth: "half" },
        { name: "fechaDeclaracion", label: "Fecha", type: "date", layoutWidth: "half" },
        {
          name: "firmaAsegurado",
          label: "Firma del Asegurado",
          type: "signature",
        },
      ],
    },
    {
      id: "datos-inspector",
      title: "Datos del Inspector",
      fields: [
        { name: "nombreInspector", label: "Nombre del Inspector", type: "text", rules: [{ type: "required", message: "Ingrese el nombre del inspector" }] },
        { name: "nroRegistroInspector", label: "N° de Registro / Legajo", type: "text" },
        { name: "fechaInspeccion", label: "Fecha de Inspección", type: "date" },
        { name: "firmaInspector", label: "Firma del Inspector", type: "signature" },
      ],
    },
    {
      id: "fotografias-vehiculo",
      title: "Fotografías del Vehículo",
      fields: [
        { name: "fotoFrontal", label: "Frontal", type: "photo", photoMax: 1 },
        { name: "fotoFrontalIzquierdo", label: "Frontal Izquierdo", type: "photo", photoMax: 1 },
        { name: "fotoFrontalDerecho", label: "Frontal Derecho", type: "photo", photoMax: 1 },
        { name: "fotoCostadoDerecho", label: "Costado Derecho", type: "photo", photoMax: 1 },
        { name: "fotoCostadoIzquierdo", label: "Costado Izquierdo", type: "photo", photoMax: 1 },
        { name: "fotoAtras", label: "Atrás", type: "photo", photoMax: 1 },
        { name: "fotoAtrasIzquierda", label: "Atrás Izquierda", type: "photo", photoMax: 1 },
        { name: "fotoAtrasDerecha", label: "Atrás Derecha", type: "photo", photoMax: 1 },
        { name: "fotoHabitaculo", label: "Habitáculo (Interior)", type: "photo", photoMax: 1 },
        { name: "fotoTablero", label: "Tablero", type: "photo", photoMax: 1 },
        { name: "fotoAsientoAtras", label: "Asiento de Atrás", type: "photo", photoMax: 1 },
        { name: "fotoValijera", label: "Valijera / Baúl", type: "photo", photoMax: 1 },
        { name: "fotoMotor", label: "Motor", type: "photo", photoMax: 1 },
        { name: "fotosDaniosAdicionales", label: "Daños Adicionales", type: "photo", photoMax: 10 },
      ],
    },
  ],
};
