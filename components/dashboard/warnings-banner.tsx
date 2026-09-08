import { TriangleAlert } from "lucide-react";

export function WarningsBanner({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2.5 text-sm text-warning"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <ul className="space-y-1">
        {warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
