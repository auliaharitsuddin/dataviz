"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDataset } from "@/lib/store/dataset-context";
import { useLanguage } from "@/lib/store/language-context";
import { UploadDropzone } from "@/components/dashboard/upload-dropzone";
import { WarningsBanner } from "@/components/dashboard/warnings-banner";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { DataTable } from "@/components/dashboard/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aggregateForChart } from "@/lib/aggregate";
import { MAX_ROWS_PER_SHEET, ParsedSheet } from "@/lib/parsers/types";
import { ChartType } from "@/lib/chart-types";

export default function Home() {
  const { dataset, status, error, activeSheetIndex, setActiveSheetIndex } = useDataset();
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "error" && error) {
      toast.error(t.uploadFailedTitle, { description: error });
    }
  }, [status, error, t]);

  if (!dataset) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
        <div className="max-w-xl space-y-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t.heroTitle}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t.heroSubtitle}
          </p>
        </div>
        <div className="w-full max-w-xl">
          <UploadDropzone />
        </div>
      </div>
    );
  }

  return <Dashboard key={dataset.fileName} sheetIndex={activeSheetIndex} onSheetChange={setActiveSheetIndex} />;
}

function Dashboard({
  sheetIndex,
  onSheetChange,
}: {
  sheetIndex: number;
  onSheetChange: (i: number) => void;
}) {
  const { dataset } = useDataset();
  const sheets = dataset!.sheets;
  const activeSheet = sheets[sheetIndex] ?? sheets[0];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 sm:p-6">
      {sheets.length > 1 && (
        <Tabs value={String(sheetIndex)} onValueChange={(v) => onSheetChange(Number(v))}>
          <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
            {sheets.map((s, i) => (
              <TabsTrigger key={s.name} value={String(i)} className="cursor-pointer">
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Keyed by sheet name so switching sheets remounts this with fresh local
          state instead of needing an effect to reset it. */}
      <SheetExplorer key={activeSheet.name} sheet={activeSheet} datasetWarnings={dataset!.warnings} />
    </div>
  );
}

function SheetExplorer({ sheet, datasetWarnings }: { sheet: ParsedSheet; datasetWarnings: string[] }) {
  const { t } = useLanguage();
  const [xKey, setXKey] = useState(sheet.columns[0]?.key ?? "");
  const [yKey, setYKey] = useState<string | null>(sheet.columns.find((c) => c.type === "number")?.key ?? null);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [search, setSearch] = useState("");

  const chartData = useMemo(
    () => (yKey ? aggregateForChart(sheet.rows, xKey, yKey, chartType === "pie" ? 6 : 12) : []),
    [sheet, xKey, yKey, chartType]
  );

  const warnings = [
    ...datasetWarnings,
    ...(sheet.truncated
      ? [t.truncatedWarning(sheet.name, MAX_ROWS_PER_SHEET.toLocaleString())]
      : []),
  ];

  const xLabel = sheet.columns.find((c) => c.key === xKey)?.label ?? xKey;
  const yLabel = sheet.columns.find((c) => c.key === yKey)?.label ?? "value";

  return (
    <>
      <WarningsBanner warnings={warnings} />

      <KpiCards sheet={sheet} />

      <FilterBar
        columns={sheet.columns}
        xKey={xKey}
        yKey={yKey}
        chartType={chartType}
        search={search}
        onXKeyChange={setXKey}
        onYKeyChange={setYKey}
        onChartTypeChange={setChartType}
        onSearchChange={setSearch}
      />

      <ChartPanel data={chartData} chartType={chartType} xLabel={xLabel} yLabel={yLabel} />

      <DataTable sheet={sheet} search={search} />
    </>
  );
}
