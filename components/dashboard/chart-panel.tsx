"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPoint } from "@/lib/aggregate";
import { CHART_COLORS } from "@/lib/chart-colors";
import { ChartType } from "@/lib/chart-types";
import { useLanguage } from "@/lib/store/language-context";

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-72 items-center justify-center text-center text-sm text-muted-foreground">{message}</div>
  );
}

export function ChartPanel({
  data,
  chartType,
  xLabel,
  yLabel,
}: {
  data: ChartPoint[];
  chartType: ChartType;
  xLabel: string;
  yLabel: string;
}) {
  const { t } = useLanguage();
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>
          {t.chartTitle(yLabel, xLabel)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyChart message={t.chartEmpty} />
        ) : (
          <div className="h-72 w-full" role="img" aria-label={t.chartAriaLabel(chartType, yLabel, xLabel)}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 12 }} width={48} />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }} />
                  <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 12 }} width={48} />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }} />
                  <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              ) : chartType === "area" ? (
                <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 12 }} width={48} />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }} />
                  <Area type="monotone" dataKey="value" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.2} />
                </AreaChart>
              ) : (
                <PieChart margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }}
                    formatter={(value, name) => {
                      const numeric = typeof value === "number" ? value : Number(value ?? 0);
                      const total = data.slice(0, 6).reduce((sum, p) => sum + p.value, 0);
                      const pct = total > 0 ? ((numeric / total) * 100).toFixed(0) : "0";
                      return [`${numeric.toLocaleString()} (${pct}%)`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Pie data={data.slice(0, 6)} dataKey="value" nameKey="name" outerRadius="80%">
                    {data.slice(0, 6).map((entry, i) => (
                      <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
