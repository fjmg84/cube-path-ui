import VpsDetailNav from "@/components/vps/vps-detail-nav";
import Link from "next/link";

type VpsDetailLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function VpsDetailLayout({
  children,
  params,
}: VpsDetailLayoutProps) {
  const { id } = await params;

  return (
    <section className="w-full">
      <div className="mb-4">
        <Link
          href="/vps"
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <span aria-hidden="true">&lt;-</span>
          <span>Volver a la lista</span>
        </Link>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Instancia
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          VPS #{id}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Navega entre las secciones del detalle de esta instancia.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">{children}</div>

        <aside className="xl:sticky xl:top-8 xl:self-start">
          <VpsDetailNav vpsId={id} />
        </aside>
      </div>
    </section>
  );
}
