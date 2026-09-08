import { NextResponse } from "next/server";
import { parseDocx } from "@/lib/parsers/docx";
import { parseExcel } from "@/lib/parsers/excel";
import { parsePdf } from "@/lib/parsers/pdf";
import { MAX_FILE_BYTES, ParsedDataset } from "@/lib/parsers/types";

export const runtime = "nodejs";

const EXT_TO_TYPE: Record<string, ParsedDataset["fileType"]> = {
  xlsx: "xlsx",
  xls: "xlsx",
  docx: "docx",
  pdf: "pdf",
};

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Request must be multipart/form-data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was provided." }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: `File is too large. Maximum size is ${MAX_FILE_BYTES / (1024 * 1024)}MB.` },
      { status: 413 }
    );
  }

  const ext = extensionOf(file.name);
  const fileType = EXT_TO_TYPE[ext];
  if (!fileType) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload .xlsx, .xls, .docx, or .pdf." },
      { status: 415 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { sheets, warnings } =
      fileType === "xlsx" ? await parseExcel(buffer) : fileType === "docx" ? await parseDocx(buffer) : await parsePdf(buffer);

    if (sheets.length === 0) {
      return NextResponse.json(
        { error: warnings[0] ?? "No tabular data could be found in this file." },
        { status: 422 }
      );
    }

    const dataset: ParsedDataset = { fileName: file.name, fileType, sheets, warnings };
    return NextResponse.json(dataset);
  } catch (err) {
    console.error("Failed to parse uploaded file", err);
    return NextResponse.json(
      { error: "This file could not be read. It may be corrupted, password-protected, or in an unsupported format." },
      { status: 422 }
    );
  }
}
