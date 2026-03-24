"use client";

import { ProjectCard } from "@/components/projects/project-card";
import type { ProjectEntry } from "@/types/project";
import useFetch from "@/hooks/useFetch";
import DisplayErrors from "../display-errors";

function ListAllProjects() {
  const {
    loading,
    error,
    data: projects,
  } = useFetch<ProjectEntry[]>("/api/projects");

  if (loading || error)
    return (
      <DisplayErrors<ProjectEntry[]>
        loading={loading}
        error={error}
        data={projects}
      />
    );

  return (
    <ul className="flex w-full flex-col gap-4">
      {projects?.map((entry) => (
        <li key={entry.project.id}>
          <ProjectCard entry={entry} />
        </li>
      ))}
    </ul>
  );
}

export default ListAllProjects;
