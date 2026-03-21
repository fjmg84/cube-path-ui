type MetricsOverviewProps = {
  vpsId: string;
  windowStartLabel: string;
  windowEndLabel: string;
  refreshing: boolean;
  lastUpdated: number | null;
  cpuNow: string;
  memoryNow: string;
  trafficNow: string;
};

export function MetricsOverview({
  vpsId,
  windowStartLabel,
  windowEndLabel,
  refreshing,
  lastUpdated,
  cpuNow,
  memoryNow,
  trafficNow,
}: MetricsOverviewProps) {
  return (
    <div className="overflow-hidden rounded-4xl border border-gray-200 bg-white/95 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-400 px-6 py-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/75">
              Monitor en tiempo real
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Metricas VPS #{vpsId}
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Ventana: {windowStartLabel} - {windowEndLabel}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${refreshing ? "animate-pulse bg-amber-200" : "bg-emerald-200"}`}
              aria-hidden="true"
            />
            <span>
              {refreshing
                ? "Actualizando..."
                : `Auto refresh cada 5s${lastUpdated ? ` · ${new Date(lastUpdated).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : ""}`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-zinc-800/80">
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            CPU actual
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-zinc-50">
            {cpuNow}
          </p>
        </div>
        <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-zinc-800/80">
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Memoria actual
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-zinc-50">
            {memoryNow}
          </p>
        </div>
        <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-zinc-800/80">
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Trafico total
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-zinc-50">
            {trafficNow}
          </p>
        </div>
      </div>
    </div>
  );
}
