export interface GeoInfo {
  ip: string;
  countryCode: string | null;
  countryName: string | null;
}

/** Best-effort IP/país del visitante, vía un servicio público gratuito (sin key) — no hay
 * backend propio en este proyecto para resolverlo del lado del servidor. Es información que
 * reporta el propio navegador, útil para auditoría normal, no una garantía a prueba de
 * manipulación. Si el servicio falla (caído, bloqueado por un adblock, sin conexión), se
 * devuelve null y la descarga sigue sin verse afectada. */
export async function fetchGeo(): Promise<GeoInfo | null> {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    if (!data.success || !data.ip) return null;
    return { ip: data.ip, countryCode: data.country_code ?? null, countryName: data.country ?? null };
  } catch {
    return null;
  }
}
