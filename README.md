# DataViz Hub

Turn spreadsheets, Word documents, and PDF reports into interactive dashboards, right in your browser. Upload a file, DataViz Hub finds the tables inside it and renders live charts, KPI cards, filters, and a searchable data table — no server-side storage, no account.

## Functions

- Parse `.xlsx` / `.xls`, `.docx`, and `.pdf` files uploaded via `POST /api/upload`
- Auto-detect tabular data inside each file (multiple sheets/tables per file supported)
- Aggregate rows into chart-ready series (bar, line, area, pie)
- Render KPI summary cards, a filter/search bar, and a paginated data table for the active sheet
- Truncate very large sheets for performance, with a visible warning banner

## All features

- File upload via drag-and-drop dropzone (`components/dashboard/upload-dropzone.tsx`)
- Multi-sheet support with tab switching (`app/page.tsx`)
- Chart types: bar, line, area, pie (`lib/chart-types.ts`, `components/dashboard/chart-panel.tsx`)
- Data aggregation by X/Y column selection (`lib/aggregate.ts`)
- KPI cards summarizing the active sheet (`components/dashboard/kpi-cards.tsx`)
- Column filter bar with chart-type and search controls (`components/dashboard/filter-bar.tsx`)
- Searchable, sortable data table (`components/dashboard/data-table.tsx`)
- Warnings banner for parse issues / truncated data (`components/dashboard/warnings-banner.tsx`)
- File parsers: Excel (`lib/parsers/excel.ts`), Word (`lib/parsers/docx.ts`), PDF (`lib/parsers/pdf.ts`), HTML tables (`lib/parsers/html-table.ts`), plain-text tables (`lib/parsers/text-table.ts`)
- Upload size limit and row-count cap enforced server-side (`lib/parsers/types.ts`, `app/api/upload/route.ts`)
- Dark/light theme support (`next-themes`)
- UI built on shadcn/Radix primitives (`components/ui/*`, `components.json`)
- npm scripts: `dev`, `build`, `start`, `lint`, `test`

## Terminology

- **Dataset** — the parsed result of one uploaded file; contains one or more sheets.
- **Sheet** — one table extracted from the file (an Excel worksheet, or a detected table inside a Word/PDF document).
- **Column** — a field in a sheet, typed as text, number, or date, used to populate chart/filter dropdowns.
- **Aggregation** — grouping rows by an X column and summing/counting a Y column to build chart series.
- **Truncation** — capping the number of displayed rows on very large sheets (`MAX_ROWS_PER_SHEET`) to keep the UI responsive.
- **Warning** — a non-fatal message surfaced when parsing partially fails or data is truncated.

## How to use

Requirements: Node.js (see `package.json` engines/deps for compatible versions), npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000, then drag in an `.xlsx`, `.xls`, `.docx`, or `.pdf` file to see the dashboard.

Other commands:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint
npm run test    # run unit tests (Node's built-in test runner)
```

No environment variables are required — all parsing happens locally on the server route, nothing is sent to a third-party API.

---

## Bahasa Indonesia

# DataViz Hub

Ubah spreadsheet, dokumen Word, dan laporan PDF menjadi dashboard interaktif langsung di browser. Unggah sebuah file, DataViz Hub akan menemukan tabel di dalamnya dan menampilkan grafik, kartu KPI, filter, serta tabel data yang bisa dicari — tanpa penyimpanan di server, tanpa akun.

## Fungsi

- Mem-parsing file `.xlsx` / `.xls`, `.docx`, dan `.pdf` yang diunggah melalui `POST /api/upload`
- Mendeteksi otomatis data tabular di dalam setiap file (mendukung banyak sheet/tabel per file)
- Mengagregasi baris data menjadi rangkaian data siap-grafik (bar, line, area, pie)
- Menampilkan kartu ringkasan KPI, bar filter/pencarian, dan tabel data dengan paginasi untuk sheet aktif
- Memotong (truncate) sheet yang sangat besar demi performa, dengan banner peringatan yang terlihat

## Semua fitur

- Unggah file via dropzone drag-and-drop (`components/dashboard/upload-dropzone.tsx`)
- Dukungan multi-sheet dengan tab untuk berpindah (`app/page.tsx`)
- Jenis grafik: bar, line, area, pie (`lib/chart-types.ts`, `components/dashboard/chart-panel.tsx`)
- Agregasi data berdasarkan pemilihan kolom X/Y (`lib/aggregate.ts`)
- Kartu KPI yang merangkum sheet aktif (`components/dashboard/kpi-cards.tsx`)
- Filter bar dengan kontrol jenis grafik dan pencarian (`components/dashboard/filter-bar.tsx`)
- Tabel data yang bisa dicari dan diurutkan (`components/dashboard/data-table.tsx`)
- Banner peringatan untuk masalah parsing / data yang terpotong (`components/dashboard/warnings-banner.tsx`)
- Parser file: Excel (`lib/parsers/excel.ts`), Word (`lib/parsers/docx.ts`), PDF (`lib/parsers/pdf.ts`), tabel HTML (`lib/parsers/html-table.ts`), tabel teks polos (`lib/parsers/text-table.ts`)
- Batas ukuran unggahan dan batas jumlah baris diterapkan di sisi server (`lib/parsers/types.ts`, `app/api/upload/route.ts`)
- Dukungan tema gelap/terang (`next-themes`)
- UI dibangun di atas komponen shadcn/Radix (`components/ui/*`, `components.json`)
- Skrip npm: `dev`, `build`, `start`, `lint`, `test`

## Istilah

- **Dataset** — hasil parsing dari satu file yang diunggah; berisi satu atau lebih sheet.
- **Sheet** — satu tabel yang diekstrak dari file (worksheet Excel, atau tabel yang terdeteksi di dalam dokumen Word/PDF).
- **Kolom (Column)** — sebuah field dalam sheet, bertipe teks, angka, atau tanggal, dipakai untuk mengisi dropdown grafik/filter.
- **Agregasi** — mengelompokkan baris berdasarkan kolom X lalu menjumlah/menghitung kolom Y untuk membentuk rangkaian data grafik.
- **Truncation (pemotongan)** — membatasi jumlah baris yang ditampilkan pada sheet yang sangat besar (`MAX_ROWS_PER_SHEET`) agar UI tetap responsif.
- **Warning (peringatan)** — pesan non-fatal yang muncul saat parsing sebagian gagal atau data terpotong.

## Cara menggunakan

Kebutuhan: Node.js (lihat `package.json` untuk versi dependensi yang kompatibel), npm.

```bash
npm install
npm run dev
```

Buka http://localhost:3000, lalu seret file `.xlsx`, `.xls`, `.docx`, atau `.pdf` untuk melihat dashboard.

Perintah lain:

```bash
npm run build   # build produksi
npm run start   # jalankan hasil build produksi
npm run lint     # lint
npm run test    # jalankan unit test (test runner bawaan Node)
```

Tidak ada environment variable yang diperlukan — semua parsing terjadi secara lokal di server route, tidak ada data yang dikirim ke API pihak ketiga.
