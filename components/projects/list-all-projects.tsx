"use client";

import LoadingSection from "@/components/loading-section";
import { ProjectCard } from "@/components/projects/project-card";
import type { ProjectEntry } from "@/types/project";
import ErrorComponent from "../error";
import NotFoundComponent from "../not-found";
import NotFoundApiKeyComponent from "../not-found-api-key";
import useFetch from "@/hooks/useFetch";

function ListAllProjects() {
  const {
    loading,
    error,
    data: projects,
    apiKey,
  } = useFetch<ProjectEntry[]>("/api/projects");

  if (loading) {
    return <LoadingSection />;
  }

  if (!apiKey) {
    return <NotFoundApiKeyComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!projects || projects.length === 0) {
    return <NotFoundComponent />;
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
