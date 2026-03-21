import { IncidentListItem } from "@/components/incidents/incident-list-item";
import { IncidentsPagination } from "@/components/incidents/incidents-pagination";
import type { Incident } from "@/types/incident";

type IncidentsSelectorPanelProps = {
  incidentsCount: number;
  incidents: Incident[];
  selectedIncidentId: number | null;
  page: number;
  totalPages: number;
  onSelectIncident: (incidentId: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function IncidentsSelectorPanel({
  incidentsCount,
  incidents,
  selectedIncidentId,
  page,
  totalPages,
  onSelectIncident,
  onPreviousPage,
  onNextPage,
}: IncidentsSelectorPanelProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
          Lista de incidentes
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-zinc-300">
          {incidentsCount} incidente(s) en total
        </p>
      </div>

      <ul className="max-h-140 overflow-auto p-2">
        {incidents.map((incident) => (
          <IncidentListItem
            key={incident.id}
            incident={incident}
            isSelected={selectedIncidentId === incident.id}
            onSelect={onSelectIncident}
          />
        ))}
      </ul>

      <IncidentsPagination
        page={page}
        totalPages={totalPages}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
      />
    </section>
  );
}
