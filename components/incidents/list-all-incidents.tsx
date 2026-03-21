"use client";

import LoadingSection from "@/components/loading-section";
import { IncidentCard } from "@/components/incidents/incident-card";
import { IncidentsSelectorPanel } from "@/components/incidents/incidents-selector-panel";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import type { Incident } from "@/types/incident";
import { useEffect, useState } from "react";

const INCIDENTS_PER_PAGE = 6;

function ListAllIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { apiKey } = useApiKeyStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!apiKey) {
      setIncidents([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchIncidents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/incidents", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            response.statusText || "No se pudieron cargar los incidentes",
          );
        }

        const data = (await response.json()) as Incident[];

        if (!isMounted) {
          return;
        }

        const nextIncidents = data || [];
        setIncidents(nextIncidents);
        setPage(1);
        setSelectedIncidentId(nextIncidents[0]?.id ?? null);
      } catch (caughtError) {
        console.error("Error fetching incidents:", caughtError);
        if (!isMounted) {
          return;
        }

        setError("No se pudieron cargar los incidentes.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchIncidents();

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  if (loading) {
    return <LoadingSection />;
  }

  if (!apiKey) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Ingresa tu API key para ver los incidentes.
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 dark:text-red-400">{error}</p>;
  }

  if (incidents.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No hay incidentes disponibles.
      </p>
    );
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
