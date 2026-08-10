<p align="center">
  <img src="src/assets/logo-meridional.png" alt="La Meridional Paraguaya S.A. de Seguros" width="220" />
</p>

<h1 align="center">Formularios Digitales — La Meridional</h1>

<p align="center">
  Plataforma web para completar y generar en PDF los formularios de seguros de La Meridional Paraguaya S.A. de Seguros.
</p>

<p align="center">
  🔗 <a href="https://pxec-py.github.io/formulario_merid/">pxec-py.github.io/formulario_merid</a>
</p>

## Formularios incluidos

- **Identificación de Personas Físicas** — datos personales, laborales y declaración jurada (Ley Nº 1.015/97, SEPRELAD).
- **Denuncia de Siniestro — Riesgos Varios**
- **Denuncia de Siniestro — Transporte de Mercaderías**

Cada formulario se completa como un wizard paso a paso (barra de progreso, validaciones, firma manuscrita) y genera al final un PDF que respeta el diseño oficial de la empresa: logo, tablas y texto legal intactos, con los datos ingresados y la firma superpuestos en su lugar exacto.

## Stack

React + TypeScript + Vite + Tailwind CSS, con generación de PDF 100% en el navegador vía [pdf-lib](https://pdf-lib.js.org/) (sin backend en esta etapa). Ver [`src/schemas`](src/schemas) para cómo se definen los formularios y [`src/services/pdf`](src/services/pdf) para el pipeline de generación.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

El sitio se publica automáticamente en GitHub Pages con cada push a `main` (ver [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).
