/** Converts a lat/lng into its OSM slippy-map tile coordinates at a given zoom, plus the
 * marker's fractional position within that tile (0..1 in both axes) — the standard
 * Web Mercator tile math (see wiki.openstreetmap.org/wiki/Slippy_map_tilenames). */
export function latLngToTile(lat: number, lng: number, zoom: number) {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  const x = ((lng + 180) / 360) * n;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  return { tileX, tileY, fracX: x - tileX, fracY: y - tileY };
}

/** Fetches one raw OSM tile PNG's bytes. Returns null (never throws) on any failure —
 * offline, or OSM's tile server being unreachable — so a map image is a nice-to-have on
 * the generated PDF, never a reason the whole document fails to generate.
 *
 * Note: this hits tile.openstreetmap.org directly (confirmed to send permissive CORS
 * headers, unlike the free "static map" services we tried first — one no longer exists,
 * another blocks non-browser requests). Fine for this app's low volume (at most a
 * couple of tiles per generated PDF); OSM's tile usage policy asks heavier users to run
 * their own tile server instead of hotlinking theirs. */
export async function fetchTilePng(zoom: number, tileX: number, tileY: number): Promise<Uint8Array | null> {
  try {
    const res = await fetch(`https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}
