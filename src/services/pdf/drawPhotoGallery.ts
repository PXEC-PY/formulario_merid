import type { Photo } from "../../types/photo";
import { BORDER_GRAY, TEXT_GRAY } from "./pageCursor";
import type { PageCursor } from "./pageCursor";

const COLS = 2;
const ROWS = 3;
const GUTTER = 14;
const CAPTION_HEIGHT = 16;
const CELL_IMAGE_HEIGHT = 130;

export interface LabeledPhoto {
  caption: string;
  photo: Photo;
}

/** Appends one or more gallery pages at the end of the generated PDF, laid out as a
 * bordered grid (2×3 per page) with each photo's slot name as a caption. Reuses the same
 * embed-then-scale-to-fit pattern already proven for the signature image in drawField.ts —
 * the only new part is the grid pagination itself. */
export async function appendPhotoGallery(cursor: PageCursor, photos: LabeledPhoto[]): Promise<void> {
  if (photos.length === 0) return;

  const cellWidth = (cursor.contentWidth - GUTTER * (COLS - 1)) / COLS;
  const cellHeight = CELL_IMAGE_HEIGHT + CAPTION_HEIGHT + 12;

  let indexOnPage = 0;

  const startGalleryPage = () => {
    cursor.newPage();
    cursor.drawSectionHeader("Fotografías del Vehículo");
    indexOnPage = 0;
  };

  startGalleryPage();

  for (const { caption, photo } of photos) {
    if (indexOnPage === COLS * ROWS) startGalleryPage();

    const col = indexOnPage % COLS;
    const row = Math.floor(indexOnPage / COLS);
    const x = cursor.contentX + col * (cellWidth + GUTTER);
    const y = cursor.y - row * (cellHeight + GUTTER) - cellHeight;

    cursor.page.drawRectangle({ x, y, width: cellWidth, height: cellHeight, borderColor: BORDER_GRAY, borderWidth: 0.75 });

    const base64 = photo.dataUrl.split(",")[1] ?? photo.dataUrl;
    const isPng = photo.dataUrl.startsWith("data:image/png");
    const image = isPng ? await cursor.outDoc.embedPng(base64) : await cursor.outDoc.embedJpg(base64);

    const imgAreaWidth = cellWidth - 10;
    const imgAreaHeight = CELL_IMAGE_HEIGHT - 6;
    const scale = Math.min(imgAreaWidth / image.width, imgAreaHeight / image.height, 1);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const imgX = x + (cellWidth - drawWidth) / 2;
    const imgY = y + CAPTION_HEIGHT + (CELL_IMAGE_HEIGHT - drawHeight) / 2;
    cursor.page.drawImage(image, { x: imgX, y: imgY, width: drawWidth, height: drawHeight });

    const captionWidth = cursor.regular.widthOfTextAtSize(caption, 8);
    cursor.page.drawText(caption, {
      x: x + Math.max(4, (cellWidth - captionWidth) / 2),
      y: y + 4,
      size: 8,
      font: cursor.regular,
      color: TEXT_GRAY,
    });

    indexOnPage++;
  }

  const rowsUsedOnLastPage = Math.ceil(indexOnPage / COLS) || 1;
  cursor.y -= rowsUsedOnLastPage * (cellHeight + GUTTER);
}
