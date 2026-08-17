/** Greedy word-wrap: breaks `text` into lines no wider than `maxWidth` according to
 * `measure`. Preserves blank lines from the source text and hard-breaks single words
 * that themselves exceed maxWidth (so one huge unbroken token can't blow out a line). */
export function wrapText(text: string, maxWidth: number, measure: (s: string) => number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (measure(candidate) <= maxWidth) {
        current = candidate;
        continue;
      }
      if (current) lines.push(current);
      if (measure(word) <= maxWidth) {
        current = word;
        continue;
      }
      // Single word wider than the box on its own — hard-break it character by character.
      let chunk = "";
      for (const char of word) {
        const candidateChunk = chunk + char;
        if (measure(candidateChunk) <= maxWidth) {
          chunk = candidateChunk;
        } else {
          lines.push(chunk);
          chunk = char;
        }
      }
      current = chunk;
    }
    lines.push(current);
  }

  return lines;
}

/** Largest single-line font size (down to `minSize`) at which `text` fits within
 * `maxWidth`, per `measure`. Used to shrink a value into a fixed-size field box before
 * falling back to truncation. */
export function computeFittingFontSize(
  text: string,
  maxWidth: number,
  measure: (text: string, size: number) => number,
  defaultSize: number,
  minSize: number
): number {
  let size = defaultSize;
  while (size > minSize && measure(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

/** Truncates `text` with an ellipsis so it fits `maxWidth` at `size`, per `measure`. */
export function truncateToWidth(text: string, maxWidth: number, measure: (text: string) => number): string {
  if (measure(text) <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && measure(`${truncated}...`) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated.length < text.length ? `${truncated}...` : truncated;
}

/** Wraps `text` into lines fitting `maxWidth`, shrinking the font step by step (down to
 * `minSize`) to fit the line budget implied by `maxHeight` at the *starting* font size, then
 * truncates any lines still left over. Shared by the manual-coordinate box renderer and the
 * AcroForm multiline filler so a free-text box never overflows its printed border either way. */
export function fitTextToBox(
  text: string,
  maxWidth: number,
  maxHeight: number,
  measure: (text: string, size: number) => number,
  defaultSize: number,
  minSize: number
): { lines: string[]; fontSize: number } {
  let fontSize = defaultSize;
  const maxLines = Math.max(1, Math.floor(maxHeight / (fontSize * 1.2)));

  let lines = wrapText(text, maxWidth, (s) => measure(s, fontSize));
  while (lines.length > maxLines && fontSize > minSize) {
    fontSize -= 0.5;
    lines = wrapText(text, maxWidth, (s) => measure(s, fontSize));
  }

  if (lines.length > maxLines) {
    const visible = lines.slice(0, maxLines);
    const last = visible[maxLines - 1] ?? "";
    visible[maxLines - 1] = last.length > 3 ? `${last.slice(0, -3)}...` : last;
    lines = visible;
  }

  return { lines, fontSize };
}
