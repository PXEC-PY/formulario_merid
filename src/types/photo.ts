/** A single photo captured/selected for a "photo" field, already downscaled to a small
 * JPEG data URL client-side (src/utils/imageResize.ts) before it ever reaches form state
 * — never the raw camera file, which could be several MB. */
export interface Photo {
  id: string;
  dataUrl: string;
  capturedAt: string;
  fileName?: string;
}
