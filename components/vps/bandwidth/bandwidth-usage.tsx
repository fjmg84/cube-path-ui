"use client";

import ErrorComponent from "@/components/error";
import LoadingSection from "@/components/loading-section";
import NotFoundComponent from "@/components/not-found";
import NotFoundApiKeyComponent from "@/components/not-found-api-key";
import { BandwidthStatCard } from "@/components/vps/bandwidth/bandwidth-stat-card";
import useFetch from "@/hooks/useFetch";
import { BandwidthUsageData } from "@/types/brandwidth";

type BandwidthUsageProps = {
  vpsId: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatUnit(value: number, unit: string) {
  return `${formatNumber(value)} ${unit}`;
}

export default function BandwidthUsage({ vpsId }: BandwidthUsageProps) {
  const {
    data: bandwidth,
    loading,
    error,
    refreshing,
    lastUpdated,
    apiKey,
  } = useFetch<BandwidthUsageData>(
    `/api/vps/?bandwidth_use=true&vps_id=${vpsId}`,
    true,
  );

  if (loading) {
    return <LoadingSection />;
  }

  if (!apiKey) {
    return <NotFoundApiKeyComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!bandwidth) {
    return <NotFoundComponent />;
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-4xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="bg-linear-to-r from-cyan-500 via-sky-500 to-emerald-400 px-6 py-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/75">
                Bandwidth
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Uso acumulado VPS #{vpsId}
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Vista de consumo entrante, saliente y total en Bytes, GB y TB.
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
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/80">
            <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Entrante total
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {formatUnit(bandwidth.in_gb, "GB")}
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/80">
            <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Saliente total
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {formatUnit(bandwidth.out_gb, "GB")}
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/80">
            <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Trafico total
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {formatUnit(bandwidth.total_gb, "GB")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BandwidthStatCard
          title="IN (bytes)"
          value={formatUnit(bandwidth.in_bytes, "B")}
          tone="sky"
        />
        <BandwidthStatCard
          title="OUT (bytes)"
          value={formatUnit(bandwidth.out_bytes, "B")}
          tone="sky"
        />
        <BandwidthStatCard
          title="TOTAL (bytes)"
          value={formatUnit(bandwidth.total_bytes, "B")}
          tone="sky"
        />

        <BandwidthStatCard
          title="IN (GB)"
          value={formatUnit(bandwidth.in_gb, "GB")}
          tone="emerald"
        />
        <BandwidthStatCard
          title="OUT (GB)"
          value={formatUnit(bandwidth.out_gb, "GB")}
          tone="emerald"
        />
        <BandwidthStatCard
          title="TOTAL (GB)"
          value={formatUnit(bandwidth.total_gb, "GB")}
          tone="emerald"
        />

        <BandwidthStatCard
          title="IN (TB)"
          value={formatUnit(bandwidth.in_tb, "TB")}
          tone="amber"
        />
        <BandwidthStatCard
          title="OUT (TB)"
          value={formatUnit(bandwidth.out_tb, "TB")}
          tone="amber"
        />
        <BandwidthStatCard
          title="TOTAL (TB)"
          value={formatUnit(bandwidth.total_tb, "TB")}
          tone="amber"
        />
      </div>
    </section>
  );
}
