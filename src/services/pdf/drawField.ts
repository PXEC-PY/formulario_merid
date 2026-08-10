import type { PDFDocument, PDFFont, PDFPage } from "pdf-lib";
import { rgb, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } from "pdf-lib";
import type { FieldSchema, PdfBinding } from "../../types/schema";
import type { FormFieldValue, LocationValue } from "../../types/formData";
import type { HandwrittenSignature } from "../../types/signature";
import { drawFittedText } from "./fitText";
import { drawSelectionCircle } from "./checkmarkOverlay";
import { formatIsoDateToDisplay, splitIsoDate, splitTime } from "../../utils/dateFormat";
import { computeFittingFontSize, truncateToWidth } from "../../utils/text";
import { fetchTilePng, latLngToTile } from "./staticMap";

const MAP_ZOOM = 17;
const TILE_SIZE = 256;
const MAX_TILES = 16;

/** Draws an OSM map snapshot (no third-party "static map" service involved — see
 * staticMap.ts for why) into `binding`'s box, with the marker always dead-center.
 *
 * Tiles are fixed 256px squares that don't line up with an arbitrary marker position, so
 * centering it exactly means the visible window almost never matches tile boundaries.
 * Fix: compute the exact pixel window (in OSM's global pixel space at MAP_ZOOM) centered
 * on the marker and sized to the box's aspect ratio, fetch every tile that window
 * overlaps, draw each at its true offset, and clip the whole thing to the box — so the
 * marker lands exactly in the middle regardless of where it falls inside its own tile.
 *
 * Best-effort: any failure (offline, tile server unreachable) just leaves the box blank
 * rather than breaking the rest of the PDF. */
async function drawLocationMap(page: PDFPage, outDoc: PDFDocument, loc: LocationValue, binding: PdfBinding) {
  if (loc.lat === undefined || loc.lng === undefined) return;

  const boxWidth = binding.maxWidth ?? 140;
  const boxHeight = binding.maxHeight ?? 65;

  // The pixel window we want to display, in OSM global-pixel space, centered on the
  // marker and matching the box's aspect ratio (one tile's worth of vertical detail).
  const windowPxHeight = TILE_SIZE;
  const windowPxWidth = windowPxHeight * (boxWidth / boxHeight);

  const { tileX, tileY, fracX, fracY } = latLngToTile(loc.lat, loc.lng, MAP_ZOOM);
  const markerPxX = (tileX + fracX) * TILE_SIZE;
  const markerPxY = (tileY + fracY) * TILE_SIZE;
  const windowLeft = markerPxX - windowPxWidth / 2;
  const windowTop = markerPxY - windowPxHeight / 2;

  const startTileX = Math.floor(windowLeft / TILE_SIZE);
  const endTileX = Math.floor((windowLeft + windowPxWidth) / TILE_SIZE);
  const startTileY = Math.floor(windowTop / TILE_SIZE);
  const endTileY = Math.floor((windowTop + windowPxHeight) / TILE_SIZE);

  const tileCoords: { tx: number; ty: number }[] = [];
  for (let ty = startTileY; ty <= endTileY; ty++) {
    for (let tx = startTileX; tx <= endTileX; tx++) tileCoords.push({ tx, ty });
  }
  if (tileCoords.length === 0 || tileCoords.length > MAX_TILES) return;

  const tileBytesList = await Promise.all(tileCoords.map(({ tx, ty }) => fetchTilePng(MAP_ZOOM, tx, ty)));
  if (tileBytesList.some((bytes) => !bytes)) return;

  const scale = boxWidth / windowPxWidth; // PDF points per OSM global pixel, uniform on both axes
  const tileImages = await Promise.all(tileBytesList.map((bytes) => outDoc.embedPng(bytes!)));

  page.pushOperators(pushGraphicsState(), rectangle(binding.x, binding.y, boxWidth, boxHeight), clip(), endPath());
  tileCoords.forEach(({ tx, ty }, i) => {
    const pdfX = binding.x + (tx * TILE_SIZE - windowLeft) * scale;
    // Tile-space y grows downward from the top; PDF y grows upward from binding.y at the
    // window's bottom edge — convert via distance from the window's top to this tile's
    // bottom edge.
    const distFromWindowTopToTileBottom = (ty + 1) * TILE_SIZE - windowTop;
    const pdfY = binding.y + boxHeight - distFromWindowTopToTileBottom * scale;
    page.drawImage(tileImages[i], { x: pdfX, y: pdfY, width: TILE_SIZE * scale, height: TILE_SIZE * scale });
  });
  page.pushOperators(popGraphicsState());

  // The marker is exactly at the window's center by construction, i.e. exactly at the
  // box's center — no separate fracX/fracY-based placement needed.
  const markerX = binding.x + boxWidth / 2;
  const markerY = binding.y + boxHeight / 2;
  // A bold ring + center dot — a tiny dot alone gets lost against a busy street map.
  const ringRadius = Math.min(12, Math.max(7, boxHeight * 0.1));
  page.drawEllipse({
    x: markerX,
    y: markerY,
    xScale: ringRadius,
    yScale: ringRadius,
    borderColor: rgb(0.86, 0.15, 0.15),
    borderWidth: 2.5,
  });
  page.drawEllipse({ x: markerX, y: markerY, xScale: 2.5, yScale: 2.5, color: rgb(0.86, 0.15, 0.15) });
}

export interface PdfFonts {
  regular: PDFFont;
}

/** Draws a single line of text. When the value is longer than its calibrated cell
 * (a long full name, address, employer, etc.), shrinks the font down to `minFontSize`
 * before finally truncating with an ellipsis — the printed line never overflows past the
 * neighboring field or the table's right edge. */
function drawSimpleText(page: PDFPage, font: PDFFont, text: string, binding: PdfBinding) {
  if (!text) return;
  const maxWidth = binding.maxWidth;
  const minSize = binding.minFontSize ?? 6.5;
  const defaultSize = binding.fontSize ?? 10;
  let size = defaultSize;
  let renderText = text;

  if (maxWidth) {
    size = computeFittingFontSize(text, maxWidth, (s, sz) => font.widthOfTextAtSize(s, sz), defaultSize, minSize);
    renderText = truncateToWidth(text, maxWidth, (s) => font.widthOfTextAtSize(s, size));
  }

  let x = binding.x;
  if (binding.align === "center" && maxWidth) {
    const width = font.widthOfTextAtSize(renderText, size);
    x = binding.x + Math.max(0, (maxWidth - width) / 2);
  }
  page.drawText(renderText, { x, y: binding.y, size, font });
}

/** Draws one field's current value onto the output page at its schema-defined
 * coordinates. Dispatches purely on `field.type` / the shape of `field.pdf` — this
 * function is identical for all 3 forms, it never branches on which form it's filling. */
export async function drawField(
  page: PDFPage,
  outDoc: PDFDocument,
  fonts: PdfFonts,
  field: FieldSchema,
  value: FormFieldValue
): Promise<void> {
  if (!field.pdf) return;

  switch (field.type) {
    case "text":
    case "phone":
    case "select": {
      const binding = field.pdf as PdfBinding;
      const text = `${binding.labelPrefix ?? ""}${value ?? ""}`;
      drawSimpleText(page, fonts.regular, text, binding);
      break;
    }

    case "email": {
      const text = (value as string) ?? "";
      if (Array.isArray(field.pdf)) {
        const [localBinding, domainBinding] = field.pdf as [PdfBinding, PdfBinding];
        const atIndex = text.indexOf("@");
        const local = atIndex >= 0 ? text.slice(0, atIndex) : text;
        const domain = atIndex >= 0 ? text.slice(atIndex + 1) : "";
        drawSimpleText(page, fonts.regular, local, localBinding);
        drawSimpleText(page, fonts.regular, domain, domainBinding);
      } else {
        drawSimpleText(page, fonts.regular, text, field.pdf as PdfBinding);
      }
      break;
    }

    case "location": {
      const loc = value as LocationValue | undefined;
      const binding = field.pdf as PdfBinding;
      if (binding.render === "location-map") {
        // A snapshot of the map — the PDF is a static document, it can't hold the real
        // interactive Leaflet map the user picked the point on. Best-effort only: no
        // coordinates picked, offline, or OSM's tile server unreachable all just leave
        // the box blank instead of failing the whole PDF generation.
        if (loc) await drawLocationMap(page, outDoc, loc, binding);
      } else {
        drawSimpleText(page, fonts.regular, loc?.label ?? "", binding);
      }
      break;
    }

    case "date": {
      const iso = (value as string) ?? "";
      if (Array.isArray(field.pdf)) {
        const [dayBinding, monthBinding, yearBinding] = field.pdf as [PdfBinding, PdfBinding, PdfBinding];
        const parts = splitIsoDate(iso);
        if (parts) {
          drawSimpleText(page, fonts.regular, parts.day, dayBinding);
          drawSimpleText(page, fonts.regular, parts.month, monthBinding);
          drawSimpleText(page, fonts.regular, parts.year, yearBinding);
        }
      } else {
        drawSimpleText(page, fonts.regular, formatIsoDateToDisplay(iso), field.pdf as PdfBinding);
      }
      break;
    }

    case "time": {
      if (Array.isArray(field.pdf)) {
        const [hourBinding, minuteBinding] = field.pdf as [PdfBinding, PdfBinding];
        const parts = splitTime((value as string) ?? "");
        if (parts) {
          drawSimpleText(page, fonts.regular, parts.hour, hourBinding);
          drawSimpleText(page, fonts.regular, parts.minute, minuteBinding);
        }
      }
      break;
    }

    case "radio-yesno": {
      const [yesBinding, noBinding] = field.pdf as [PdfBinding, PdfBinding];
      if (value === true) drawSelectionCircle(page, yesBinding);
      if (value === false) drawSelectionCircle(page, noBinding);
      break;
    }

    case "textarea": {
      drawFittedText(page, fonts.regular, (value as string) ?? "", field.pdf as PdfBinding);
      break;
    }

    case "signature": {
      const signature = value as HandwrittenSignature | undefined;
      if (!signature) break;
      const binding = field.pdf as PdfBinding;
      const base64 = signature.dataUrl.split(",")[1] ?? signature.dataUrl;
      const pngImage = await outDoc.embedPng(base64);
      const maxWidth = binding.maxWidth ?? 150;
      const maxHeight = binding.maxHeight ?? 40;
      const scale = Math.min(maxWidth / pngImage.width, maxHeight / pngImage.height, 1);
      page.drawImage(pngImage, {
        x: binding.x,
        y: binding.y,
        width: pngImage.width * scale,
        height: pngImage.height * scale,
      });
      break;
    }

    default:
      break;
  }
}
