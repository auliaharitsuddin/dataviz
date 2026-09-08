"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ParsedDataset } from "@/lib/parsers/types";

const STORAGE_KEY = "dataviz.dataset.v1";

type Status = "idle" | "loading" | "error";

interface DatasetContextValue {
  dataset: ParsedDataset | null;
  status: Status;
  error: string | null;
  activeSheetIndex: number;
  setActiveSheetIndex: (i: number) => void;
  upload: (file: File) => Promise<void>;
  clear: () => void;
}

const DatasetContext = createContext<DatasetContextValue | null>(null);

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  useEffect(() => {
    // Must stay an effect (not a lazy useState initializer): the server always
    // renders the empty state, so client state has to start null too and only
    // swap in the persisted dataset after mount, or hydration would mismatch.
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDataset(JSON.parse(raw) as ParsedDataset);
    } catch {
      // corrupted or unavailable storage — start fresh
    }
  }, []);

  const persist = useCallback((next: ParsedDataset | null) => {
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage full or unavailable — dataset still works in-memory for this session
    }
  }, []);

  const upload = useCallback(
    async (file: File) => {
      setStatus("loading");
      setError(null);
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error ?? "Upload failed.");
        }
        setDataset(json as ParsedDataset);
        setActiveSheetIndex(0);
        persist(json as ParsedDataset);
        setStatus("idle");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    },
    [persist]
  );

  const clear = useCallback(() => {
    setDataset(null);
    setActiveSheetIndex(0);
    setStatus("idle");
    setError(null);
    persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({ dataset, status, error, activeSheetIndex, setActiveSheetIndex, upload, clear }),
    [dataset, status, error, activeSheetIndex, upload, clear]
  );

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
}

export function useDataset() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error("useDataset must be used within a DatasetProvider");
  return ctx;
}
