import { useState } from "react";
import type { FieldSchema } from "../../types/schema";
import type { LocationValue } from "../../types/formData";
import { FieldWrapper, baseInputClasses, inputBorderClass } from "./FieldWrapper";
import { useLocationMap } from "../../hooks/useLocationMap";
import { searchAddress, reverseGeocode } from "../../services/geocoding";

interface LocationFieldProps {
  field: FieldSchema;
  value: LocationValue | undefined;
  onChange: (value: LocationValue) => void;
  error?: string;
}

/** Address text input backed by an interactive OpenStreetMap (search a place, drag the
 * marker, or use the device's current location) — stores `{ label, lat, lng }`, same
 * shape the PDF pipeline already expects. Falls back gracefully to a plain typed address
 * with no coordinates if the user never touches the map. */
export function LocationField({ field, value, onChange, error }: LocationFieldProps) {
  const isRequired = field.rules?.some((r) => r.type === "required") ?? false;
  const [query, setQuery] = useState(value?.label ?? "");
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleMarkerMove = (lat: number, lng: number) => {
    onChange({ label: value?.label ?? query, lat, lng });
    reverseGeocode(lat, lng)
      .then((result) => {
        if (!result) return;
        setQuery(result.label);
        onChange({ label: result.label, lat, lng });
      })
      .catch(() => {
        // Keep the pin where the user put it even if reverse geocoding fails —
        // lat/lng are already saved, only the address text stays unresolved.
      });
  };

  const { containerRef, flyTo } = useLocationMap(handleMarkerMove, { lat: value?.lat, lng: value?.lng });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setMapError(null);
    try {
      const results = await searchAddress(query);
      const first = results[0];
      if (!first) {
        setMapError("No se encontró esa dirección");
        return;
      }
      flyTo(first.lat, first.lng);
      setQuery(first.label);
      onChange({ label: first.label, lat: first.lat, lng: first.lng });
    } catch {
      setMapError("No se pudo buscar la dirección");
    } finally {
      setSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError("Tu dispositivo no permite obtener la ubicación");
      return;
    }
    setLocating(true);
    setMapError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        flyTo(latitude, longitude);
        const result = await reverseGeocode(latitude, longitude).catch(() => null);
        const label = result?.label ?? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setQuery(label);
        onChange({ label, lat: latitude, lng: longitude });
        setLocating(false);
      },
      () => {
        setMapError("No se pudo obtener tu ubicación");
        setLocating(false);
      }
    );
  };

  return (
    <FieldWrapper label={field.label} htmlFor={field.name} error={error ?? mapError ?? undefined} required={isRequired}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            id={field.name}
            type="text"
            className={`${baseInputClasses} ${inputBorderClass(!!error, !!value?.label)}`}
            placeholder={field.placeholder ?? "Buscar dirección..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange({ label: e.target.value, lat: value?.lat, lng: value?.lng });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            aria-invalid={!!error}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="min-h-11 shrink-0 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </div>
        <div ref={containerRef} className="h-56 w-full overflow-hidden rounded-lg border border-slate-300" />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="flex min-h-11 w-fit items-center gap-1.5 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          📍 {locating ? "Ubicando..." : "Usar mi ubicación"}
        </button>
        {value?.lat !== undefined && value?.lng !== undefined && (
          <p className="text-xs text-slate-400">
            Lat: {value.lat.toFixed(6)}, Long: {value.lng.toFixed(6)}
          </p>
        )}
      </div>
    </FieldWrapper>
  );
}
