"use client";

import LoadingSection from "@/components/loading-section";
import { ProjectCard } from "@/components/projects/project-card";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import type { ProjectEntry } from "@/types/project";
import { useEffect, useState } from "react";

function ListAllProjects() {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const { apiKey } = useApiKeyStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setProjects([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/projects", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            response.statusText || "No se pudieron cargar los proyectos",
          );
        }

        const data = (await response.json()) as ProjectEntry[];

        if (!isMounted) return;

        setProjects(data || []);
      } catch (caughtError) {
        console.error("Error fetching projects:", caughtError);
        if (!isMounted) return;
        setError("No se pudieron cargar los proyectos.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchProjects();

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
        Ingresa tu API key para ver los proyectos.
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 dark:text-red-400">{error}</p>;
  }

  if (projects.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        No hay proyectos disponibles.
      </p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-4">
      {projects.map((entry) => (
        <li key={entry.project.id}>
          <ProjectCard entry={entry} />
        </li>
      ))}
    </ul>
  );
}

export default ListAllProjects;
