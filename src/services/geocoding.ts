export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
  city?: string;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

/** Forward geocoding — turns a free-text address into candidate points. Uses Nominatim,
 * OpenStreetMap's free public geocoder (no API key). Its usage policy caps request
 * volume for anonymous browser traffic; fine for this app's scale, but not meant for
 * high-volume production use without a dedicated/self-hosted instance. */
export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    countrycodes: "py",
  });
  const res = await fetch(`${NOMINATIM_BASE}/search?${params.toString()}`);
  if (!res.ok) throw new Error("No se pudo buscar la dirección");
  const results = (await res.json()) as NominatimResult[];
  return results.map(toGeocodeResult);
}

/** Reverse geocoding — turns a point (e.g. after dragging the map marker) back into a
 * readable address, so the text field stays in sync with where the pin actually is. */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lng), format: "jsonv2", addressdetails: "1" });
  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params.toString()}`);
  if (!res.ok) return null;
  const result = (await res.json()) as NominatimResult;
  if (!result || (result as { error?: string }).error) return null;
  return toGeocodeResult(result);
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
}

function toGeocodeResult(result: NominatimResult): GeocodeResult {
  return {
    label: result.display_name,
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    city: result.address?.city ?? result.address?.town ?? result.address?.village ?? result.address?.municipality,
  };
}
