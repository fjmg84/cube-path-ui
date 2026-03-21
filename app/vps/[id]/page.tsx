import MetricsVPS from "@/components/vps/metrics-vps";
import Link from "next/link";

type VpsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VpsDetailPage({ params }: VpsDetailPageProps) {
  const { id } = await params;

  return (
    <section className="w-full">
      <div className="mb-4">
        <Link
          href={`/vps`}
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 hover:cursor-pointer"
          aria-label={`View all VPS instances`}
        >
          <span aria-hidden="true">&lt;-</span>
          <span>Volver a la lista</span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Detalles VPS #{id}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Navega entre las secciones del detalle de esta instancia.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div id="metrics" className="min-w-0">
          <MetricsVPS vpsId={id} />
        </div>

        <aside className="xl:sticky xl:top-8 xl:self-start">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Secciones
            </p>

            <nav className="mt-3 flex flex-col gap-2">
              <a
                href="#metrics"
                className="rounded-lg bg-sky-100 px-3 py-2 text-sm font-medium text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
              >
                Metricas
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </section>
  );
}
