import type { DataRow } from "./parsers/types.ts";

export interface ChartPoint {
  name: string;
  value: number;
}

/**
 * Sums yKey grouped by xKey, then keeps the largest categories and folds the
 * rest into "Other" so charts stay readable (per no-pie-overuse / data-density guidance).
 */
export function aggregateForChart(
  rows: DataRow[],
  xKey: string,
  yKey: string,
  maxCategories = 12
): ChartPoint[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    const rawX = row[xKey];
    const x = rawX === null || rawX === undefined || rawX === "" ? "(blank)" : String(rawX);
    const y = row[yKey];
    const yNum = typeof y === "number" ? y : 0;
    totals.set(x, (totals.get(x) ?? 0) + yNum);
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

  if (sorted.length <= maxCategories) return sorted;

  const top = sorted.slice(0, maxCategories - 1);
  const otherTotal = sorted.slice(maxCategories - 1).reduce((sum, p) => sum + p.value, 0);
  return [...top, { name: "Other", value: otherTotal }];
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
}
