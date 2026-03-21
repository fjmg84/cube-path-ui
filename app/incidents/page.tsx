import ListAllIncidents from "@/components/incidents/list-all-incidents";

export default function IncidentsPage() {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Incidentes
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Estado e historial de incidentes de la plataforma.
      </p>

      <div className="mt-6">
        <ListAllIncidents />
      </div>
    </section>
  );
}
