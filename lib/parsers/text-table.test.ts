import { test } from "node:test";
import assert from "node:assert/strict";
import { splitIntoTable } from "./text-table.ts";

test("splits on wide gaps when present", () => {
  const text = "Region   Month   Revenue\nNorth   Jan   12500\nSouth   Feb   9800";
  const table = splitIntoTable(text);
  assert.deepEqual(table?.header, ["Region", "Month", "Revenue"]);
  assert.equal(table?.rows.length, 2);
});

test("falls back to single-space split when token counts are consistent", () => {
  const text = "Region Month Revenue\nNorth Jan 12500\nSouth Feb 9800\nEast Mar 15600";
  const table = splitIntoTable(text);
  assert.deepEqual(table?.header, ["Region", "Month", "Revenue"]);
  assert.equal(table?.rows.length, 3);
});

test("returns null for prose with inconsistent token counts", () => {
  const text =
    "This is a short paragraph.\nIt has lines of very different lengths and word counts.\nNo table here at all really.";
  assert.equal(splitIntoTable(text), null);
});

test("drops PDF page-marker noise lines before building the grid", () => {
  const text = "Region Month Revenue\nNorth Jan 12500\n-- 1 of 1 --\nSouth Feb 9800";
  const table = splitIntoTable(text);
  assert.equal(table?.rows.length, 2);
  assert.ok(!table?.rows.some((r) => r.some((c) => c.includes("--"))));
});

test("returns null when fewer than 2 non-empty lines", () => {
  assert.equal(splitIntoTable("just one line"), null);
  assert.equal(splitIntoTable(""), null);
});
