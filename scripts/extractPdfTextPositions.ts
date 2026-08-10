// Dev-only utility, not part of the app build.
// Dumps every text run of a template PDF with its exact x/y (PDF points, bottom-left origin),
// width and height, so field coordinates can be derived precisely instead of guessed by eye.
// Usage: npx tsx scripts/extractPdfTextPositions.ts src/assets/templates/riesgos-varios.pdf
import { readFileSync } from "node:fs";
// @ts-expect-error legacy build has no bundled types export path in this form
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx tsx scripts/extractPdfTextPositions.ts <path-to-pdf>");
    process.exit(1);
  }

  const data = new Uint8Array(readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();

    console.log(`\n=== Page ${pageNum} (width=${viewport.width.toFixed(2)}, height=${viewport.height.toFixed(2)}) ===`);

    for (const item of content.items as Array<{ str: string; transform: number[]; width: number; height: number }>) {
      if (!item.str.trim()) continue;
      const [, , , , e, f] = item.transform; // e = x, f = y (already bottom-left origin, pdf points)
      console.log(
        `${item.str.padEnd(45)} x=${e.toFixed(2).padStart(8)} y=${f.toFixed(2).padStart(8)} w=${item.width.toFixed(2).padStart(7)} h=${item.height.toFixed(2)}`
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
