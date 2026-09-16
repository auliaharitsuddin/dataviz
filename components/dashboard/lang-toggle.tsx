"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/store/language-context";

export function LangToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div role="group" aria-label={t.langToggleLabel} className="flex gap-0.5 rounded-lg bg-muted p-1">
      {(["id", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          data-lang={code}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={cn(
            "h-6 cursor-pointer rounded-md px-2 text-xs font-medium uppercase transition-colors",
            lang === code
              ? "bg-card text-primary shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
