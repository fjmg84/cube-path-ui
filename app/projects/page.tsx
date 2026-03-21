import ListAllProjects from "@/components/projects/list-all-projects";

export default function ProjectsPage() {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Proyectos
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Lista de proyectos con sus recursos asociados.
      </p>

      <div className="mt-6">
        <ListAllProjects />
      </div>
    </section>
  );
}
