function isConsistentTable(grid: string[][]): boolean {
  if (grid.length < 2) return false;
  const headerCols = grid[0].length;
  if (headerCols < 2) return false;
  const matching = grid.filter((r) => r.length === headerCols).length;
  return matching / grid.length >= 0.7;
}

/**
 * Best-effort split of loose text into a table. Tries wide gaps (2+ spaces or
 * a tab) first — the common case for text copy/pasted from a real table —
 * then falls back to single-space splitting, only accepting it when most
 * lines share the same token count (otherwise prose would misfire as a table).
 */
export function splitIntoTable(text: string): { header: string[]; rows: string[][] } | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^--\s*\d+\s+of\s+\d+\s*--$|^page\s+\d+\s+of\s+\d+$/i.test(l));
  if (lines.length < 2) return null;

  const wide = lines.map((l) => l.split(/\s{2,}|\t/).map((c) => c.trim()).filter(Boolean));
  const narrow = lines.map((l) => l.split(/\s+/).map((c) => c.trim()).filter(Boolean));

  const grid = isConsistentTable(wide) ? wide : isConsistentTable(narrow) ? narrow : null;
  if (!grid) return null;

  const [header, ...rows] = grid;
  return { header, rows };
}
