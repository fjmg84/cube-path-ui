import Link from "next/link";
import { StatusBadge } from "../status-badge";
import type { ProjectEntry } from "@/types/project";
import { InfoRow } from "../info-row";

export function ProjectCard({ entry }: { entry: ProjectEntry }) {
  const { project, vps, networks, baremetals } = entry;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-zinc-800">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900 dark:text-zinc-100">
            {project.name}
          </h3>
          <p className="truncate text-xs text-gray-500 dark:text-zinc-400">
            {project.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          ID #{project.id}
        </span>
      </div>

      {/* Resources summary */}
      <div className="grid divide-y divide-gray-100 dark:divide-zinc-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            VPS
          </p>
          {vps.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-zinc-500">
              Sin instancias
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {vps.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/vps/${v.id}`}
                    className="truncate text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
                  >
                    {v.name}
                  </Link>
                  <StatusBadge status={v.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Redes
          </p>
          <p className="text-sm text-gray-400 dark:text-zinc-500">
            {networks.length === 0 ? "Sin redes" : `${networks.length} red(es)`}
          </p>
        </div>

        <div className="px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Bare Metal
          </p>
          <p className="text-sm text-gray-400 dark:text-zinc-500">
            {baremetals.length === 0
              ? "Sin servidores"
              : `${baremetals.length} servidor(es)`}
          </p>
        </div>
      </div>

      {/* VPS detail rows */}
      {vps.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4 dark:border-zinc-800">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
            Detalle de instancias
          </p>
          <div className="flex flex-col gap-3">
            {vps.map((v) => {
              const ipv4 = v.floating_ips.list.find((ip) => ip.type === "IPv4");
              return (
                <div
                  key={v.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Link
                      href={`/vps/${v.id}`}
                      className="text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400"
                    >
                      {v.name}
                    </Link>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
                    <InfoRow label="Plan" value={v.plan.plan_name} />
                    <InfoRow label="CPU" value={`${v.plan.cpu} vCPU`} />
                    <InfoRow label="RAM" value={`${v.plan.ram / 1024} GB`} />
                    <InfoRow
                      label="IPv4"
                      value={
                        ipv4 ? (
                          <code className="rounded bg-white px-1.5 py-0.5 text-xs dark:bg-zinc-900">
                            {ipv4.address}
                          </code>
                        ) : (
                          "—"
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
