"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ParsedSheet } from "@/lib/parsers/types";
import { useLanguage } from "@/lib/store/language-context";

const PAGE_SIZE = 25;

export function DataTable({ sheet, search }: { sheet: ParsedSheet; search: string }) {
  const { t } = useLanguage();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  // Reset to page 1 whenever the search text or active sheet changes, without an
  // effect: adjust state directly during render (react.dev/learn/you-might-not-need-an-effect).
  const resetSignal = `${sheet.name}::${search}`;
  const [prevResetSignal, setPrevResetSignal] = useState(resetSignal);
  if (resetSignal !== prevResetSignal) {
    setPrevResetSignal(resetSignal);
    setPage(0);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return sheet.rows;
    const q = search.trim().toLowerCase();
    return sheet.rows.filter((row) =>
      sheet.columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(q))
    );
  }, [sheet, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv));
    });
    if (sortDir === "desc") copy.reverse();
    return copy;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(clampedPage * PAGE_SIZE, clampedPage * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
      <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow className="hover:bg-transparent">
              {sheet.columns.map((c) => {
                const active = sortKey === c.key;
                return (
                  <TableHead key={c.key} aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="flex cursor-pointer items-center gap-1 text-left hover:text-primary"
                    >
                      {c.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="size-3.5" aria-hidden />
                        ) : (
                          <ArrowDown className="size-3.5" aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-muted-foreground/50" aria-hidden />
                      )}
                    </button>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={sheet.columns.length} className="h-24 text-center text-muted-foreground">
                  {t.noRowsMatch}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, i) => (
                <TableRow key={clampedPage * PAGE_SIZE + i}>
                  {sheet.columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(c.type === "number" && "text-right tabular-nums")}
                    >
                      {row[c.key] === null ? <span className="text-muted-foreground/50">—</span> : String(row[c.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {sorted.length === 0
            ? t.zeroRows
            : t.showingRows(clampedPage * PAGE_SIZE + 1, Math.min(sorted.length, (clampedPage + 1) * PAGE_SIZE), sorted.length)}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={clampedPage === 0}
            aria-label={t.prevPage}
            className="cursor-pointer"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <span className="min-w-16 text-center text-xs">
            {t.pageOf(clampedPage + 1, pageCount)}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={clampedPage >= pageCount - 1}
            aria-label={t.nextPage}
            className="cursor-pointer"
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
