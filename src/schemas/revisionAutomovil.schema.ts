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
  title: "Inspección de Riesgo - Sección Automóviles",
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
      id: "carroceria-frontal",
      title: "3.1.1 Carrocería y Exterior — Frontal",
      fields: [
        {
          name: "checklistFrontal",
          label: "",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "parachoquesDelantero", label: "Parachoques delantero" },
            { key: "farosDelanteros", label: "Faros delanteros" },
            { key: "buscahuellas", label: "Buscahuellas" },
            { key: "parrilla", label: "Parrilla" },
            { key: "spoilerDelantero", label: "Spoiler delantero" },
            { key: "capo", label: "Capó" },
            { key: "parabrisas", label: "Parabrisas" },
            { key: "techo", label: "Techo" },
            { key: "otrosFrontal", label: "Otros" },
          ],
        },
        {
          name: "tipoFarosDelanteros",
          label: "Tipo de faros delanteros",
          type: "select",
          options: [
            { value: "halogeno", label: "Halógeno" },
            { value: "xenon", label: "Xenón" },
            { value: "led", label: "LED" },
            { value: "lupa", label: "Lupa" },
          ],
        },
      ],
    },
    {
      id: "carroceria-lateral",
      title: "3.1.2 Carrocería y Exterior — Lateral (Derecho e Izquierdo)",
      fields: [
        {
          name: "checklistLateral",
          label: "",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "puertas", label: "Puertas" },
            { key: "guardabarros", label: "Guardabarros" },
            { key: "retrovisores", label: "Retrovisores" },
            { key: "vidriosPuertas", label: "Vidrios de puertas" },
            { key: "zocalos", label: "Zócalos" },
            { key: "neumaticos", label: "Neumáticos" },
            { key: "llantas", label: "Llantas" },
            { key: "otrosLateral", label: "Otros" },
          ],
        },
      ],
    },
    {
      id: "carroceria-trasera",
      title: "3.1.3 Carrocería y Exterior — Trasera",
      fields: [
        {
          name: "checklistTrasera",
          label: "",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "parachoquesTrasero", label: "Parachoques trasero" },
            { key: "faroTrasero", label: "Faro trasero" },
            { key: "tapaTrasera", label: "Tapa trasera / Baúl" },
            { key: "aleron", label: "Alerón" },
            { key: "antena", label: "Antena" },
            { key: "otrosTrasera", label: "Otros" },
          ],
        },
        { name: "faroTraseroLed", label: "¿Faro trasero es LED?", type: "radio-yesno" },
      ],
    },
    {
      id: "interior",
      title: "3.2 Interior",
      fields: [
        {
          name: "checklistInterior",
          label: "",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "tapiceriaAsientos", label: "Tapicería / Asientos" },
            { key: "tablero", label: "Tablero" },
            { key: "cinturonSeguridad", label: "Cinturón de seguridad" },
            { key: "aireAcondicionadoInterior", label: "Aire acondicionado" },
            { key: "sistemaSonido", label: "Radio" },
            { key: "otrosInterior", label: "Otros" },
          ],
        },
        {
          name: "tipoSistemaSonido",
          label: "Tipo de Radio",
          type: "select",
          layoutWidth: "half",
          options: [
            { value: "pantalla", label: "Con pantalla" },
            { value: "disco", label: "Con reproductor de disco" },
            { value: "pendrive", label: "Solo entrada USB / Pendrive" },
            { value: "android-carplay", label: "Digital — Android Auto / Apple CarPlay" },
          ],
        },
        { name: "tieneAlarma", label: "¿Tiene alarma?", type: "radio-yesno", layoutWidth: "half" },
        {
          name: "tipoAlarma",
          label: "Tipo de alarma",
          type: "select",
          layoutWidth: "half",
          showIf: { field: "tieneAlarma", equals: true },
          options: [
            { value: "fabrica", label: "De fábrica" },
            { value: "generica", label: "Genérica / Post-venta" },
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
          label: "",
          type: "checklist-table",
          options: SI_NO_OPTIONS,
          tableRows: [
            { key: "cedulaVerde", label: "Cédula Verde" },
            { key: "habilitacionMunicipal", label: "Habilitación" },
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
          label: "",
          type: "checklist-table",
          options: BUENO_REGULAR_MALO_OPTIONS,
          tableRows: [
            { key: "motor", label: "Motor" },
            { key: "transmision", label: "Transmisión" },
            { key: "frenos", label: "Frenos" },
            { key: "suspension", label: "Suspensión" },
            { key: "direccion", label: "Dirección" },
            { key: "aireAcondicionadoMecanica", label: "Aire acondicionado" },
            { key: "otrosMecanica", label: "Otros" },
          ],
        },
        {
          name: "tipoCombustible",
          label: "Tipo de motor / combustible",
          type: "select",
          layoutWidth: "half",
          options: [
            { value: "nafta", label: "Nafta" },
            { value: "diesel", label: "Diésel" },
            { value: "hibrido", label: "Híbrido" },
            { value: "electrico", label: "Eléctrico" },
          ],
        },
        {
          name: "tipoTransmision",
          label: "Tipo de transmisión",
          type: "select",
          layoutWidth: "half",
          options: [
            { value: "manual", label: "Manual" },
            { value: "automatica", label: "Automática" },
          ],
        },
        {
          name: "tipoDireccion",
          label: "Tipo de dirección",
          type: "select",
          options: [
            { value: "hidraulica", label: "Hidráulica" },
            { value: "semi-asistida", label: "Semi-asistida" },
            { value: "electrica", label: "Eléctrica" },
            { value: "otro", label: "Otro" },
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
          label: "",
          type: "checklist-table",
          options: SI_NO_OPTIONS,
          tableRows: [
            { key: "portaBulto", label: "Porta Bulto" },
            { key: "equipoSonidoAdicional", label: "Equipo de sonido adicional (parlantes grandes)" },
            { key: "defensaFrontalMetal", label: "Defensa frontal de metal" },
            { key: "defensaTraseraMetal", label: "Defensa trasera de metal" },
            { key: "buscahuellasAccesorio", label: "Buscahuellas" },
            { key: "barraLed", label: "Barra LED" },
            { key: "carpaMaritimaRigida", label: "Carpa marítima o rígida" },
            { key: "tiraTrailer", label: "Tiratrailer" },
            { key: "antivuelco", label: "Antivuelco" },
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
        { name: "fotoRadio", label: "Radio", type: "photo", photoMax: 1 },
        { name: "fotosDaniosAdicionales", label: "Daños Adicionales", type: "photo", photoMax: 10 },
        { name: "fotoAccesoriosAgregados", label: "Accesorios Agregados por el Dueño", type: "photo", photoMax: 14 },
      ],
    },
  ],
};
