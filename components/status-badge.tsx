type StatusBadgeTone = "gray" | "green" | "emerald" | "zinc";

type StatusBadgeProps = {
  status: string;
  positiveStatuses?: string[];
  positiveTone?: Extract<StatusBadgeTone, "green" | "emerald">;
  neutralTone?: Extract<StatusBadgeTone, "gray" | "zinc">;
};

const toneClasses: Record<StatusBadgeTone, { badge: string; dot: string }> = {
  gray: {
    badge: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400",
    dot: "bg-gray-400",
  },
  green: {
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    dot: "bg-green-500",
  },
  emerald: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  zinc: {
    badge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    dot: "bg-zinc-400",
  },
};

export function StatusBadge({
  status,
  positiveStatuses = ["active"],
  positiveTone = "green",
  neutralTone = "gray",
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const isPositive = positiveStatuses.some(
    (value) => value.toLowerCase() === normalizedStatus,
  );
  const tone = isPositive
    ? toneClasses[positiveTone]
    : toneClasses[neutralTone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {status}
    </span>
  );
}
