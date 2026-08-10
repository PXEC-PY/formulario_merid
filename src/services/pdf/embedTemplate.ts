import { PDFDocument } from "pdf-lib";

const templateCache = new Map<string, Promise<ArrayBuffer>>();

/** Fetches a template PDF's bytes once per session (memoized) — shared by both the
 * overlay strategy (below) and the AcroForm strategy (fillAcroFormPdf.ts). */
export function loadTemplateBytes(url: string): Promise<ArrayBuffer> {
  let cached = templateCache.get(url);
  if (!cached) {
    cached = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`No se pudo cargar la plantilla PDF (${url})`);
      return res.arrayBuffer();
    });
    templateCache.set(url, cached);
  }
  return cached;
}

/** Embeds the official template's page as a vector-exact background of the output
 * document — preserves the logo, ruled tables and legal text pixel/vector-perfect. Used
 * for templates with no fillable AcroForm fields (both denuncia forms); Personas Físicas
 * has real fillable fields and uses fillAcroFormPdf.ts instead. */
export async function embedTemplateBackground(outDoc: PDFDocument, templateUrl: string) {
  const bytes = await loadTemplateBytes(templateUrl);
  const templateDoc = await PDFDocument.load(bytes);
  const [embeddedPage] = await outDoc.embedPages(templateDoc.getPages());
  const page = outDoc.addPage([embeddedPage.width, embeddedPage.height]);
  page.drawPage(embeddedPage, { x: 0, y: 0 });
  return page;
}
