import type { Incident } from "@/types/incident";

type IncidentListItemProps = {
  incident: Incident;
  isSelected: boolean;
  onSelect: (incidentId: number) => void;
};

function formatDate(dateText: string | null) {
  if (!dateText) {
    return "-";
  }

  return new Date(dateText).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityTone(severity: string) {
  if (severity === "high") {
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  }

  if (severity === "medium") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  }

  return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
}

export function IncidentListItem({
  incident,
  isSelected,
  onSelect,
}: IncidentListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(incident.id)}
        className={`mb-2 w-full rounded-lg border px-3 py-2 text-left transition ${
          isSelected
            ? "border-sky-200 bg-sky-50 dark:border-sky-900/70 dark:bg-sky-900/20"
            : "border-gray-200 bg-white hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">
            {incident.title}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${severityTone(incident.severity)}`}
          >
            {incident.severity}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
          {incident.location_name}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
          {formatDate(incident.started_at)}
        </p>
      </button>
    </li>
  );
}
