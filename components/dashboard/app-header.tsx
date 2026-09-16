"use client";

import { BarChart3, FileSpreadsheet, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/lib/store/dataset-context";
import { useLanguage } from "@/lib/store/language-context";
import { LangToggle } from "@/components/dashboard/lang-toggle";

export function AppHeader() {
  const { dataset, clear } = useDataset();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BarChart3 className="size-4.5" aria-hidden />
        </div>
        <span className="truncate text-sm font-semibold tracking-tight sm:text-base">{t.appName}</span>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {dataset && (
          <>
            <Badge variant="secondary" className="hidden max-w-40 truncate sm:inline-flex md:max-w-64">
              <FileSpreadsheet className="size-3.5" aria-hidden />
              <span className="truncate">{dataset.fileName}</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={clear} className="cursor-pointer">
              <RotateCcw className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">{t.newFile}</span>
            </Button>
          </>
        )}
        <LangToggle />
      </div>
    </header>
  );
}
