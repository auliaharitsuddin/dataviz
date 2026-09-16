"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en } from "@/messages/en";
import { id } from "@/messages/id";
import type { Messages } from "@/messages/en";

type Lang = "en" | "id";
const DICTS: Record<Lang, Messages> = { en, id };
const STORAGE_KEY = "dataviz-lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Messages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") setLangState(stored);
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
