"use client";

import LoadingSection from "@/components/loading-section";
import { MetricCard, type MetricPoint } from "@/components/vps/metric-card";
import { MetricsOverview } from "@/components/vps/metrics-overview";
import formatBytes from "@/lib/format-bytes";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import { useEffect, useState } from "react";

type RangeKey = "5m" | "15m" | "1h" | "all";

type VpsMetrics = {
  start: number;
  end: number;
  metrics: {
    cpu_usage: MetricPoint[];
    disk_read_usage: MetricPoint[];
    disk_write_usage: MetricPoint[];
    network_receive_usage: MetricPoint[];
    network_transmit_usage: MetricPoint[];
    memory_usage: MetricPoint[];
  };
};

const vps_id = "22570"; // Reemplaza con el ID real de la VPS que deseas consultar

const rangeConfig: Record<RangeKey, { label: string; seconds: number | null }> =
  {
    "5m": { label: "5m", seconds: 5 * 60 },
    "15m": { label: "15m", seconds: 15 * 60 },
    "1h": { label: "1h", seconds: 60 * 60 },
    all: { label: "Todo", seconds: null },
  };

function filterByRange(
  data: MetricPoint[],
  endTimestamp: number,
  range: RangeKey,
) {
  const seconds = rangeConfig[range].seconds;
  if (seconds === null) {
    return data;
  }

  const minTimestamp = endTimestamp - seconds;
  const filtered = data.filter(([timestamp]) => timestamp >= minTimestamp);

  if (filtered.length > 0) {
    return filtered;
  }

  return data.length > 0 ? [data[data.length - 1]] : [];
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatThroughput(value: number) {
  return `${formatBytes(value)}/s`;
}

function formatDateTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

function getLatestValue(data: MetricPoint[]) {
  return data[data.length - 1]?.[1] ?? 0;
}

function getAverageValue(data: MetricPoint[]) {
  if (data.length === 0) {
    return 0;
  }

  return data.reduce((sum, [, value]) => sum + value, 0) / data.length;
}

function getPeakValue(data: MetricPoint[]) {
  if (data.length === 0) {
    return 0;
  }

  return Math.max(...data.map(([, value]) => value));
}

function MetricsVPS() {
  const [vpsMetrics, setVpsMetrics] = useState<VpsMetrics | null>(null);
  const { apiKey } = useApiKeyStore();
  const [selectedRange, setSelectedRange] = useState<RangeKey>("15m");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setVpsMetrics(null);
      setLoading(false);
      setRefreshing(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchMetrics = async (isBackgroundRefresh = false) => {
      if (!isMounted) {
        return;
      }

      setError(null);
      if (isBackgroundRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(`/api/vps/metrics?vps_id=${vps_id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            response.statusText || "No se pudieron cargar las metricas",
          );
        }

        const data = (await response.json()) as VpsMetrics;

        if (!isMounted) {
          return;
        }

        setVpsMetrics(data);
        setLastUpdated(Date.now());
      } catch (caughtError) {
        console.error("Error fetching VPS data:", caughtError);
        if (!isMounted) {
          return;
        }

        setError("No se pudieron cargar las metricas de la VPS.");
      } finally {
        if (!isMounted) {
          return;
        }

        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchMetrics();
    const intervalId = window.setInterval(() => {
      void fetchMetrics(true);
    }, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [apiKey]);

  if (loading) {
    return <LoadingSection />;
  }

  if (!apiKey) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        Ingresa tu API key para ver las metricas de la VPS.
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 dark:text-red-400">{error}</p>;
  }

  if (!vpsMetrics) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        No hay metricas disponibles.
      </p>
    );
  }

  const rangeEndTimestamp = vpsMetrics.end;

  const cpu = filterByRange(
    vpsMetrics.metrics.cpu_usage,
    rangeEndTimestamp,
    selectedRange,
  );
  const memory = filterByRange(
    vpsMetrics.metrics.memory_usage,
    rangeEndTimestamp,
    selectedRange,
  );
  const diskRead = filterByRange(
    vpsMetrics.metrics.disk_read_usage,
    rangeEndTimestamp,
    selectedRange,
  );
  const diskWrite = filterByRange(
    vpsMetrics.metrics.disk_write_usage,
    rangeEndTimestamp,
    selectedRange,
  );
  const networkReceive = filterByRange(
    vpsMetrics.metrics.network_receive_usage,
    rangeEndTimestamp,
    selectedRange,
  );
  const networkTransmit = filterByRange(
    vpsMetrics.metrics.network_transmit_usage,
    rangeEndTimestamp,
    selectedRange,
  );

  const rangeOptions = (Object.keys(rangeConfig) as RangeKey[]).map(
    (rangeKey) => ({
      key: rangeKey,
      label: rangeConfig[rangeKey].label,
    }),
  );

  return (
    <section className="flex w-full flex-col gap-6">
      <MetricsOverview
        vpsId={vps_id}
        windowStartLabel={formatDateTime(vpsMetrics.start)}
        windowEndLabel={formatDateTime(vpsMetrics.end)}
        refreshing={refreshing}
        lastUpdated={lastUpdated}
        rangeOptions={rangeOptions}
        selectedRange={selectedRange}
        onSelectRange={(rangeKey) => setSelectedRange(rangeKey as RangeKey)}
        cpuNow={formatPercent(getLatestValue(cpu))}
        memoryNow={formatBytes(getLatestValue(memory))}
        trafficNow={formatThroughput(
          getLatestValue(networkReceive) + getLatestValue(networkTransmit),
        )}
      />

      <div className="grid w-full gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="CPU"
          value={formatPercent(getLatestValue(cpu))}
          average={formatPercent(getAverageValue(cpu))}
          peak={formatPercent(getPeakValue(cpu))}
          data={cpu}
          color="sky"
        />
        <MetricCard
          title="Memoria"
          value={formatBytes(getLatestValue(memory))}
          average={formatBytes(getAverageValue(memory))}
          peak={formatBytes(getPeakValue(memory))}
          data={memory}
          color="violet"
        />
        <MetricCard
          title="Lectura de disco"
          value={formatThroughput(getLatestValue(diskRead))}
          average={formatThroughput(getAverageValue(diskRead))}
          peak={formatThroughput(getPeakValue(diskRead))}
          data={diskRead}
          color="emerald"
        />
        <MetricCard
          title="Escritura de disco"
          value={formatThroughput(getLatestValue(diskWrite))}
          average={formatThroughput(getAverageValue(diskWrite))}
          peak={formatThroughput(getPeakValue(diskWrite))}
          data={diskWrite}
          color="amber"
        />
        <MetricCard
          title="Red entrante"
          value={formatThroughput(getLatestValue(networkReceive))}
          average={formatThroughput(getAverageValue(networkReceive))}
          peak={formatThroughput(getPeakValue(networkReceive))}
          data={networkReceive}
          color="cyan"
        />
        <MetricCard
          title="Red saliente"
          value={formatThroughput(getLatestValue(networkTransmit))}
          average={formatThroughput(getAverageValue(networkTransmit))}
          peak={formatThroughput(getPeakValue(networkTransmit))}
          data={networkTransmit}
          color="fuchsia"
        />
      </div>
    </section>
  );
}

export default MetricsVPS;
