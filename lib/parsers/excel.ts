import ExcelJS from "exceljs";
import { buildTable } from "./build-table";
import { ParsedSheet } from "./types";

function cellValue(cell: ExcelJS.Cell): unknown {
  const v = cell.value;
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v;
  if (typeof v === "object") {
    if ("richText" in v) return v.richText.map((t) => t.text).join(""); // rich text
    if ("result" in v) return v.result ?? null; // formula
    if ("text" in v) return v.text ?? null; // hyperlink
  }
  return v;
}

export async function parseExcel(buffer: Buffer): Promise<{ sheets: ParsedSheet[]; warnings: string[] }> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

  const sheets: ParsedSheet[] = [];
  const warnings: string[] = [];

  workbook.worksheets.forEach((ws) => {
    if (ws.rowCount === 0 || ws.state === "hidden" || ws.state === "veryHidden") return;

    const allRows: unknown[][] = [];
    ws.eachRow({ includeEmpty: false }, (row) => {
      const cells: unknown[] = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        cells.push(cellValue(cell));
      });
      allRows.push(cells);
    });
    if (allRows.length === 0) return;

    const [header, ...dataRows] = allRows;
    const nonEmptyDataRows = dataRows.filter((r) => r.some((c) => c !== null && c !== undefined && String(c).trim() !== ""));
    if (nonEmptyDataRows.length === 0) return;

    sheets.push(buildTable(ws.name, header, nonEmptyDataRows));
  });

  if (sheets.length === 0) {
    warnings.push("No non-empty sheets with data were found in this workbook.");
  }

  return { sheets, warnings };
}
