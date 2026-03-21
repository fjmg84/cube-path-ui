import type { ReactNode } from "react";

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-gray-500 dark:text-zinc-400">{label}</span>
      <span className="text-right font-medium text-gray-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}