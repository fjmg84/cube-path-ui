import { InfoRow } from "../info-row";
import { StatusBadge } from "../status-badge";
import type { Incident } from "@/types/incident";

function SeverityBadge({ severity }: { severity: string }) {
  const tone =
    severity === "high"
      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      : severity === "medium"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}
    >
      {severity}
    </span>
  );
}

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

export function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <article className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-zinc-800">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">
            {incident.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            {incident.location_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge
            status={incident.status}
            positiveStatuses={["resolved"]}
            positiveTone="emerald"
            neutralTone="zinc"
          />
        </div>
      </div>

      <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Resumen
          </p>
          <p className="whitespace-pre-line text-sm text-gray-700 dark:text-zinc-300">
            {incident.description}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Detalles
          </p>
          <InfoRow label="Inició" value={formatDate(incident.started_at)} />
          <InfoRow label="Resuelto" value={formatDate(incident.resolved_at)} />
          <InfoRow
            label="Servicios"
            value={
              incident.affected_services &&
              incident.affected_services.length > 0
                ? incident.affected_services.join(", ")
                : "Todos / no especificado"
            }
          />
          <InfoRow label="Updates" value={incident.updates.length} />
        </div>
      </div>

      {incident.updates.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4 dark:border-zinc-800">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Historial de actualizaciones
          </p>
          <ul className="flex flex-col gap-3">
            {incident.updates.map((update) => (
              <li
                key={update.id}
                className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50"
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <StatusBadge
                    status={update.status}
                    positiveStatuses={["resolved"]}
                    positiveTone="emerald"
                    neutralTone="zinc"
                  />
                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                    {formatDate(update.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-300">
                  {update.message}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
