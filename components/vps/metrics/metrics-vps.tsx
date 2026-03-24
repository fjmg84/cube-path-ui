"use client";

import ErrorComponent from "@/components/error";
import LoadingSection from "@/components/loading-section";
import NotFoundComponent from "@/components/not-found";
import NotFoundApiKeyComponent from "@/components/not-found-api-key";
import {
  MetricCard,
  type MetricPoint,
} from "@/components/vps/metrics/metric-card";
import { MetricsOverview } from "@/components/vps/metrics/metrics-overview";
import useFetch from "@/hooks/useFetch";
import formatBytes from "@/lib/format-bytes";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import { useEffect, useState } from "react";

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

type MetricsVPSProps = {
  vpsId: string;
};

function MetricsVPS({ vpsId }: MetricsVPSProps) {
  /*
  const { apiKey } = useApiKeyStore();
  const [vpsMetrics, setVpsMetrics] = useState<VpsMetrics | null>(null);
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
        const response = await fetch(`/api/vps/?metrics=true&vps_id=${vpsId}`, {
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
  }, [apiKey, vpsId]); */

  const {
    loading,
    error,
    data: vpsMetrics,
    apiKey,
    refreshing,
    lastUpdated,
  } = useFetch<VpsMetrics>(`/api/vps/?metrics=true&vps_id=${vpsId}`, true);

  if (loading) {
    return <LoadingSection />;
  }

  if (!apiKey) {
    return <NotFoundApiKeyComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!vpsMetrics) {
    return <NotFoundComponent />;
  }

  const cpu = vpsMetrics.metrics.cpu_usage;
  const memory = vpsMetrics.metrics.memory_usage;
  const diskRead = vpsMetrics.metrics.disk_read_usage;
  const diskWrite = vpsMetrics.metrics.disk_write_usage;
  const networkReceive = vpsMetrics.metrics.network_receive_usage;
  const networkTransmit = vpsMetrics.metrics.network_transmit_usage;

  return (
    <section className="flex w-full flex-col gap-6">
      <MetricsOverview
        vpsId={vpsId}
        windowStartLabel={formatDateTime(vpsMetrics.start)}
        windowEndLabel={formatDateTime(vpsMetrics.end)}
        refreshing={refreshing}
        lastUpdated={lastUpdated}
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
