import { PDFParse } from "pdf-parse";
import { buildTable } from "./build-table";
import { splitIntoTable } from "./text-table";
import { ParsedSheet } from "./types";

export async function parsePdf(buffer: Buffer): Promise<{ sheets: ParsedSheet[]; warnings: string[] }> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const warnings: string[] = [];
  const sheets: ParsedSheet[] = [];

  try {
    const tableResult = await parser.getTable();
    let tableIndex = 0;
    tableResult.pages.forEach((page, pageIdx) => {
      page.tables.forEach((table) => {
        const nonEmpty = table.filter((row) => row.some((c) => c.trim() !== ""));
        if (nonEmpty.length < 2) return;
        tableIndex += 1;
        const [header, ...rows] = nonEmpty;
        sheets.push(buildTable(`Page ${pageIdx + 1} Table ${tableIndex}`, header, rows));
      });
    });

    if (sheets.length === 0) {
      const textResult = await parser.getText();
      const table = splitIntoTable(textResult.text);

      if (table) {
        warnings.push(
          "No ruled tables were detected in this PDF — text was split into columns by whitespace as a best-effort guess. Results may be inaccurate."
        );
        sheets.push(buildTable("Text", table.header, table.rows));
      } else {
        warnings.push("No tabular data could be detected in this PDF.");
      }
    }
  } finally {
    await parser.destroy();
  }

  return { sheets, warnings };
}
