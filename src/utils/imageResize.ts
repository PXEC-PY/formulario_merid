/** Downscales/recompresses a picked or camera-captured image file into a small JPEG data
 * URL. Called once per photo at capture time (never at PDF-build time) — a phone camera
 * photo is routinely 3000-4000px and several MB, and a form can hold ~20+ of them, so
 * doing this eagerly is what keeps both form state and the generated PDF a manageable
 * size instead of ballooning into tens of megabytes. */
export async function resizeImageToDataUrl(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", quality);
}
