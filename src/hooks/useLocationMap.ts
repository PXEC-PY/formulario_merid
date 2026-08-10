import { useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet's default marker icon paths assume a plain file server — under Vite they
// resolve to broken URLs unless we point them at the bundler-resolved asset URLs
// ourselves. Must run once, before any L.marker(...) is created.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: L.LatLngTuple = [-25.2637, -57.5759]; // Asunción, Paraguay
const DEFAULT_ZOOM = 13;
const PIN_ZOOM = 16;

/** Imperative Leaflet wiring behind a ref + effect — same pattern as useSignaturePad for
 * the canvas. Renders an OpenStreetMap tile map with a single draggable marker; clicking
 * the map or dragging the marker calls `onMarkerMove(lat, lng)` so the caller can
 * reverse-geocode and update its own address text. */
export function useLocationMap(onMarkerMove: (lat: number, lng: number) => void, initial?: { lat?: number; lng?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onMarkerMoveRef = useRef(onMarkerMove);
  onMarkerMoveRef.current = onMarkerMove;

  const placeMarker = (lat: number, lng: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      return;
    }
    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onMarkerMoveRef.current(pos.lat, pos.lng);
    });
    markerRef.current = marker;
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const hasInitial = initial?.lat !== undefined && initial?.lng !== undefined;
    const map = L.map(containerRef.current).setView(
      hasInitial ? [initial!.lat!, initial!.lng!] : DEFAULT_CENTER,
      hasInitial ? PIN_ZOOM : DEFAULT_ZOOM
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      placeMarker(e.latlng.lat, e.latlng.lng);
      onMarkerMoveRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    if (hasInitial) placeMarker(initial!.lat!, initial!.lng!);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Only wire up the map once per mount — subsequent position updates go through
    // flyTo(), not through re-running this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyTo = (lat: number, lng: number) => {
    placeMarker(lat, lng);
    mapRef.current?.flyTo([lat, lng], PIN_ZOOM);
  };

  return { containerRef, flyTo };
}
