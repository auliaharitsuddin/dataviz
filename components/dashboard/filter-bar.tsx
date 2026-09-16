"use client";

import { BarChart3, LineChart, PieChart, AreaChart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@/lib/parsers/types";
import { ChartType } from "@/lib/chart-types";
import { useLanguage } from "@/lib/store/language-context";
import type { Messages } from "@/messages/en";

const CHART_OPTIONS: { type: ChartType; labelKey: keyof Pick<Messages, "chartBar" | "chartLine" | "chartArea" | "chartPie">; icon: typeof BarChart3 }[] = [
  { type: "bar", labelKey: "chartBar", icon: BarChart3 },
  { type: "line", labelKey: "chartLine", icon: LineChart },
  { type: "area", labelKey: "chartArea", icon: AreaChart },
  { type: "pie", labelKey: "chartPie", icon: PieChart },
];

interface FilterBarProps {
  columns: ColumnDef[];
  xKey: string;
  yKey: string | null;
  chartType: ChartType;
  search: string;
  onXKeyChange: (key: string) => void;
  onYKeyChange: (key: string) => void;
  onChartTypeChange: (type: ChartType) => void;
  onSearchChange: (value: string) => void;
}

export function FilterBar({
  columns,
  xKey,
  yKey,
  chartType,
  search,
  onXKeyChange,
  onYKeyChange,
  onChartTypeChange,
  onSearchChange,
}: FilterBarProps) {
  const { t } = useLanguage();
  const numericColumns = columns.filter((c) => c.type === "number");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
      <div className="flex min-w-36 flex-1 flex-col gap-1.5 sm:flex-none">
        <Label htmlFor="x-axis" className="text-xs text-muted-foreground">
          {t.groupBy}
        </Label>
        <Select value={xKey} onValueChange={onXKeyChange}>
          <SelectTrigger id="x-axis" className="w-full sm:w-44">
            <SelectValue placeholder={t.selectColumn} />
          </SelectTrigger>
          <SelectContent>
            {columns.map((c) => (
              <SelectItem key={c.key} value={c.key}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-36 flex-1 flex-col gap-1.5 sm:flex-none">
        <Label htmlFor="y-axis" className="text-xs text-muted-foreground">
          {t.measure}
        </Label>
        <Select value={yKey ?? undefined} onValueChange={onYKeyChange} disabled={numericColumns.length === 0}>
          <SelectTrigger id="y-axis" className="w-full sm:w-44">
            <SelectValue placeholder={numericColumns.length === 0 ? t.noNumericColumns : t.selectColumn} />
          </SelectTrigger>
          <SelectContent>
            {numericColumns.map((c) => (
              <SelectItem key={c.key} value={c.key}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">{t.chartType}</Label>
        <div role="group" aria-label={t.chartType} className="flex gap-1 rounded-lg bg-muted p-1">
          {CHART_OPTIONS.map(({ type, labelKey, icon: Icon }) => (
            <button
              key={type}
              type="button"
              aria-pressed={chartType === type}
              onClick={() => onChartTypeChange(type)}
              className={cn(
                "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                chartType === type
                  ? "bg-card text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              <span className="hidden md:inline">{t[labelKey]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 sm:ml-auto sm:w-64 sm:flex-none">
        <Label htmlFor="table-search" className="text-xs text-muted-foreground">
          {t.searchTable}
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="table-search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.filterRowsPlaceholder}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}
