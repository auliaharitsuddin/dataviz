import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregateForChart } from "./aggregate.ts";
import type { DataRow } from "./parsers/types.ts";

function rows(pairs: [string, number][]): DataRow[] {
  return pairs.map(([region, revenue]) => ({ region, revenue }));
}

test("sums value grouped by key, sorted descending", () => {
  const data = rows([
    ["North", 10],
    ["North", 5],
    ["South", 30],
  ]);
  const result = aggregateForChart(data, "region", "revenue");
  assert.deepEqual(result, [
    { name: "South", value: 30 },
    { name: "North", value: 15 },
  ]);
});

test("folds overflow categories into Other", () => {
  const data = rows([
    ["A", 5],
    ["B", 4],
    ["C", 3],
    ["D", 2],
    ["E", 1],
  ]);
  const result = aggregateForChart(data, "region", "revenue", 3);
  assert.equal(result.length, 3);
  assert.equal(result[2].name, "Other");
  assert.equal(result[2].value, 3 + 2 + 1); // C + D + E folded
});

test("treats missing/blank group values as (blank) and non-numeric measures as 0", () => {
  const data: DataRow[] = [{ region: null, revenue: "n/a" as unknown as number }];
  const result = aggregateForChart(data, "region", "revenue");
  assert.deepEqual(result, [{ name: "(blank)", value: 0 }]);
});
