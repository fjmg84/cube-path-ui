import { useVpsStore } from "@/store/useVpsSelected";
import type { VPS } from "@/types/vps";

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
          : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
      />
      {status}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-gray-500 dark:text-zinc-400">{label}</span>
      <span className="text-right font-medium text-gray-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

export function VpsCard({ vps }: { vps: VPS }) {
  const { saveVps } = useVpsStore();
  const ipv4 = vps.floating_ips.list.find((ip) => ip.type === "IPv4");
  const ipv6 = vps.floating_ips.list.find((ip) => ip.type === "IPv6");

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-zinc-800">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900 dark:text-zinc-100">
            {vps.name}
          </h3>
          <p className="truncate text-xs text-gray-500 dark:text-zinc-400">
            {vps.hostname}
          </p>
        </div>
        <StatusBadge status={vps.status} />
      </div>

      <div className="grid divide-y divide-gray-100 dark:divide-zinc-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {/* Plan */}
        <div className="px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Plan · {vps.plan.plan_name}
          </p>
          <InfoRow label="CPU" value={`${vps.plan.cpu} vCPU`} />
          <InfoRow label="RAM" value={`${vps.plan.ram / 1024} GB`} />
          <InfoRow label="Almacenamiento" value={`${vps.plan.storage} GB`} />
          <InfoRow label="Ancho de banda" value={`${vps.plan.bandwidth} TB`} />
          <InfoRow
            label="Precio / hora"
            value={`$${vps.plan.price_per_hour.toFixed(5)}`}
          />
        </div>

        {/* Details */}
        <div className="px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Detalles
          </p>
          <InfoRow label="SO" value={vps.template.os_name} />
          <InfoRow label="Ubicación" value={vps.location.description} />
          <InfoRow label="Proyecto" value={vps.project.name} />
          {ipv4 && (
            <InfoRow
              label="IPv4"
              value={
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                  {ipv4.address}
                </code>
              }
            />
          )}
          {ipv6 && (
            <InfoRow
              label="IPv6"
              value={
                <code className="truncate rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                  {ipv6.address}
                </code>
              }
            />
          )}
        </div>

        <div className="flex items-center justify-end px-5 py-4 sm:col-span-2">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 hover:cursor-pointer"
            aria-label={`View details for ${vps.name}`}
            onClick={() => saveVps(vps.id)}
          >
            <span>View Details</span>
            <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
