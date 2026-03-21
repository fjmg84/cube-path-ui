type BandwidthStatCardProps = {
  title: string;
  value: string;
  tone?: "sky" | "emerald" | "amber";
};

const toneStyles: Record<
  NonNullable<BandwidthStatCardProps["tone"]>,
  string
> = {
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

export function BandwidthStatCard({
  title,
  value,
  tone = "sky",
}: BandwidthStatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {title}
      </p>
      <div
        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${toneStyles[tone]}`}
      >
        {value}
      </div>
    </div>
  );
}
