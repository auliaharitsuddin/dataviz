"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileSpreadsheet, FileText, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDataset } from "@/lib/store/dataset-context";

const ACCEPT = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/pdf": [".pdf"],
};

export function UploadDropzone({ compact = false }: { compact?: boolean }) {
  const { upload, status } = useDataset();
  const isLoading = status === "loading";

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        toast.error("Unsupported file", {
          description: "Please upload a .xlsx, .xls, .docx, or .pdf file.",
        });
        return;
      }
      const file = accepted[0];
      if (file) void upload(file);
    },
    [upload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: 1,
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-accent/40 text-center transition-colors",
        "hover:border-primary hover:bg-accent",
        isDragActive && "border-primary bg-accent",
        isLoading && "cursor-not-allowed opacity-70",
        compact ? "p-6" : "p-10 sm:p-16"
      )}
    >
      <input {...getInputProps()} aria-label="Upload file" />
      {isLoading ? (
        <>
          <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
          <p className="text-sm font-medium text-foreground">Reading your file…</p>
        </>
      ) : (
        <>
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
            <UploadCloud className="size-7" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {isDragActive ? "Drop the file here" : "Drag & drop a file, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">Supported: .xlsx, .xls, .docx, .pdf — up to 15MB</p>
          </div>
          <div className="mt-1 flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1 text-xs">
              <FileSpreadsheet className="size-3.5" aria-hidden /> Excel
            </span>
            <span className="flex items-center gap-1 text-xs">
              <FileText className="size-3.5" aria-hidden /> Word / PDF
            </span>
          </div>
        </>
      )}
    </div>
  );
}
