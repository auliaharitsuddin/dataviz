export type ColumnType = "number" | "date" | "string";

export interface ColumnDef {
  key: string;
  label: string;
  type: ColumnType;
}

export type RowValue = string | number | null;
export type DataRow = Record<string, RowValue>;

export interface ParsedSheet {
  name: string;
  columns: ColumnDef[];
  rows: DataRow[];
  truncated: boolean;
}

export interface ParsedDataset {
  fileName: string;
  fileType: "xlsx" | "docx" | "pdf";
  sheets: ParsedSheet[];
  warnings: string[];
}

export const MAX_ROWS_PER_SHEET = 5000;
export const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB
