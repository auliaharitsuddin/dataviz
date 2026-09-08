const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#39|amp|lt|gt|quot|nbsp);/g, (_, e) => ENTITY_MAP[e] ?? _);
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/** Minimal extractor for the simple <table><tr><td> markup mammoth produces from Word tables. */
export function extractHtmlTables(html: string): { header: string[]; rows: string[][] }[] {
  const tables: { header: string[]; rows: string[][] }[] = [];
  const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) ?? [];

  for (const tableHtml of tableMatches) {
    const rowMatches = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    const grid: string[][] = rowMatches.map((rowHtml) => {
      const cellMatches = rowHtml.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? [];
      return cellMatches.map((c) => stripTags(c));
    });
    const nonEmpty = grid.filter((r) => r.some((c) => c !== ""));
    if (nonEmpty.length < 2) continue; // need a header + at least one data row
    const [header, ...rows] = nonEmpty;
    tables.push({ header, rows });
  }

  return tables;
}
