"use client";

import LoadingSection from "@/components/loading-section";
import { IncidentCard } from "@/components/incidents/incident-card";
import { IncidentsSelectorPanel } from "@/components/incidents/incidents-selector-panel";
import type { Incident } from "@/types/incident";
import { useState } from "react";
import NotFoundComponent from "../not-found";
import ErrorComponent from "../error";
import NotFoundApiKeyComponent from "../not-found-api-key";
import useFetch from "@/hooks/useFetch";

const INCIDENTS_PER_PAGE = 6;

function ListAllIncidents() {
  const [page, setPage] = useState(1);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(
    null,
  );

  const {
    loading,
    error,
    data: incidents,
    apiKey,
  } = useFetch<Incident[]>("/api/incidents");

  if (loading) {
    return <LoadingSection />;
  }

  if (!apiKey) {
    return <NotFoundApiKeyComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!incidents || incidents.length === 0) {
    return <NotFoundComponent />;
  }

  const totalPages = Math.max(
    1,
    Math.ceil(incidents.length / INCIDENTS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * INCIDENTS_PER_PAGE;
  const end = start + INCIDENTS_PER_PAGE;
  const paginatedIncidents = incidents.slice(start, end);

  const selectedIncident =
    incidents.find((incident) => incident.id === selectedIncidentId) ||
    paginatedIncidents[0] ||
    incidents[0];

  const selectPage = (nextPage: number) => {
    const boundedPage = Math.min(Math.max(1, nextPage), totalPages);
    const nextStart = (boundedPage - 1) * INCIDENTS_PER_PAGE;
    const nextList = incidents.slice(nextStart, nextStart + INCIDENTS_PER_PAGE);

    setPage(boundedPage);
    setSelectedIncidentId(nextList[0]?.id ?? incidents[0]?.id ?? null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <IncidentsSelectorPanel
        incidentsCount={incidents.length}
        incidents={paginatedIncidents}
        selectedIncidentId={selectedIncident?.id ?? null}
        page={safePage}
        totalPages={totalPages}
        onSelectIncident={setSelectedIncidentId}
        onPreviousPage={() => selectPage(safePage - 1)}
        onNextPage={() => selectPage(safePage + 1)}
      />

      <section>
        {selectedIncident ? (
          <IncidentCard incident={selectedIncident} />
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Selecciona una incidencia para ver el detalle.
          </p>
        )}
      </section>
    </div>
  );
}

export default ListAllIncidents;
