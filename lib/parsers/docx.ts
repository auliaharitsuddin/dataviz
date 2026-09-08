import mammoth from "mammoth";
import { buildTable } from "./build-table";
import { extractHtmlTables } from "./html-table";
import { splitIntoTable } from "./text-table";
import { ParsedSheet } from "./types";

export async function parseDocx(buffer: Buffer): Promise<{ sheets: ParsedSheet[]; warnings: string[] }> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const warnings: string[] = [];
  const tables = extractHtmlTables(html);

  if (tables.length > 0) {
    const sheets = tables.map((t, i) =>
      buildTable(tables.length > 1 ? `Table ${i + 1}` : "Table", t.header, t.rows)
    );
    return { sheets, warnings };
  }

  // No tables in the document — fall back to splitting plain text lines on whitespace.
  const { value: text } = await mammoth.extractRawText({ buffer });
  const table = splitIntoTable(text);
  if (!table) {
    return { sheets: [], warnings: ["No tables or tabular text found in this document."] };
  }

  warnings.push(
    "No table found in this .docx — text was split into columns by whitespace as a best-effort guess. Results may be inaccurate."
  );
  return { sheets: [buildTable("Text", table.header, table.rows)], warnings };
}
