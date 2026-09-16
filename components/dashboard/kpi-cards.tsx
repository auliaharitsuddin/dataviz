import { Hash, Rows3, Sigma, Columns3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ParsedSheet } from "@/lib/parsers/types";
import { formatNumber } from "@/lib/aggregate";
import { useLanguage } from "@/lib/store/language-context";

function Kpi({ icon: Icon, label, value }: { icon: typeof Hash; label: string; value: string }) {
  return (
    <Card className="gap-0 py-4">
      <CardContent className="flex items-center gap-3 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="size-4.5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-lg font-semibold tabular-nums text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCards({ sheet }: { sheet: ParsedSheet }) {
  const { t } = useLanguage();
  const numericCol = sheet.columns.find((c) => c.type === "number");
  const sum = numericCol
    ? sheet.rows.reduce((acc, r) => acc + (typeof r[numericCol.key] === "number" ? (r[numericCol.key] as number) : 0), 0)
    : 0;
  const avg = numericCol && sheet.rows.length > 0 ? sum / sheet.rows.length : 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Kpi icon={Rows3} label={t.kpiTotalRows} value={formatNumber(sheet.rows.length)} />
      <Kpi icon={Columns3} label={t.kpiTotalColumns} value={formatNumber(sheet.columns.length)} />
      {numericCol ? (
        <>
          <Kpi icon={Sigma} label={t.kpiSumOf(numericCol.label)} value={formatNumber(sum)} />
          <Kpi icon={Hash} label={t.kpiAvgOf(numericCol.label)} value={formatNumber(avg)} />
        </>
      ) : (
        <>
          <Kpi icon={Sigma} label={t.kpiNumericColumns} value="0" />
          <Kpi icon={Hash} label={t.kpiTextColumns} value={formatNumber(sheet.columns.length)} />
        </>
      )}
    </div>
  );
}
