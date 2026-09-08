import { ColumnDef, DataRow, MAX_ROWS_PER_SHEET, ParsedSheet, RowValue } from "./types";

const NUMERIC_RE = /^-?[\d,]+(\.\d+)?%?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}(T|$)|^\d{1,2}\/\d{1,2}\/\d{2,4}$/;

function coerceCell(raw: unknown): RowValue {
  if (raw === null || raw === undefined) return null;
  if (raw instanceof Date) return raw.toISOString();
  if (typeof raw === "number") return raw;
  const text = String(raw).trim();
  if (text === "") return null;
  if (NUMERIC_RE.test(text)) {
    const n = Number(text.replace(/,/g, "").replace(/%$/, ""));
    if (!Number.isNaN(n)) return n;
  }
  return text;
}

function inferColumnType(values: RowValue[]): ColumnDef["type"] {
  const nonNull = values.filter((v) => v !== null);
  if (nonNull.length === 0) return "string";
  const numericCount = nonNull.filter((v) => typeof v === "number").length;
  if (numericCount / nonNull.length >= 0.7) return "number";
  const dateCount = nonNull.filter((v) => typeof v === "string" && DATE_RE.test(v)).length;
  if (dateCount / nonNull.length >= 0.7) return "date";
  return "string";
}

function uniqueKey(base: string, used: Set<string>): string {
  let key = base || "column";
  let i = 2;
  while (used.has(key)) {
    key = `${base}_${i++}`;
  }
  used.add(key);
  return key;
}

/** Builds a ParsedSheet from a header row + raw data rows (array-of-arrays), inferring column types and truncating for safety. */
export function buildTable(sheetName: string, header: unknown[], dataRows: unknown[][]): ParsedSheet {
  const used = new Set<string>();
  const keys = header.map((h, i) => {
    const label = h === null || h === undefined || String(h).trim() === "" ? `Column ${i + 1}` : String(h).trim();
    return { key: uniqueKey(label.toLowerCase().replace(/\s+/g, "_").slice(0, 40), used), label };
  });

  const truncated = dataRows.length > MAX_ROWS_PER_SHEET;
  const limited = truncated ? dataRows.slice(0, MAX_ROWS_PER_SHEET) : dataRows;

  const rows: DataRow[] = limited.map((r) => {
    const row: DataRow = {};
    keys.forEach((k, i) => {
      row[k.key] = coerceCell(r[i]);
    });
    return row;
  });

  const columns: ColumnDef[] = keys.map((k) => ({
    key: k.key,
    label: k.label,
    type: inferColumnType(rows.map((r) => r[k.key])),
  }));

  return { name: sheetName, columns, rows, truncated };
}
