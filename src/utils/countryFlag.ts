/** ISO 3166-1 alpha-2 country code -> flag emoji, via the regional indicator symbol
 * trick (each letter A-Z maps to its own Unicode "regional indicator" code point). */
export function countryFlagEmoji(countryCode: string | null | undefined): string {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 0x1f1e6 - 65 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
