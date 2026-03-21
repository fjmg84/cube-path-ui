"use client";

import LoadingSection from "@/components/loading-section";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import { useEffect, useState } from "react";

type BackupSettings = {
  enabled: boolean;
  schedule_hour: number;
  retention_days: number;
  max_backups: number;
  id: number;
  vps_id: number;
  created_at: string;
  updated_at: string;
};

type BackupItem = {
  id: number;
  vps_id: number;
  backup_type: string | null;
  backup_volid: string;
  status: string | null;
  progress: number;
  size_gb: number;
  pbs_storage: string;
  started_at: string;
  completed_at: string;
  error_message: string;
  notes: string;
  created_at: string;
};

type BackupsResponse = {
  backups: BackupItem[];
  total: number;
  has_settings: boolean;
  settings: BackupSettings | null;
};

type BackupListProps = {
  vpsId: string;
};

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatStatus(status: string | null) {
  if (!status) return "Sin estado";
  return status.replaceAll("_", " ");
}

function statusBadgeClass(status: string | null) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";
    case "failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
    case "running":
    case "in_progress":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
    case "pending":
      return "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300";
    default:
      return "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200";
  }
}

export function BackupList({ vpsId }: BackupListProps) {
  const [backupsData, setBackupsData] = useState<BackupsResponse | null>(null);
  const { apiKey } = useApiKeyStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setBackupsData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchBackups = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/vps/backups?vps_id=${vpsId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(response.statusText || "Failed to fetch backups");
        }

        const data = (await response.json()) as BackupsResponse;
        if (!isMounted) return;
        setBackupsData(data);
      } catch (caughtError) {
        console.error("Error fetching backups:", caughtError);
        if (!isMounted) return;
        setError("No se pudieron cargar los backups.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchBackups();

    return () => {
      isMounted = false;
    };
  }, [apiKey, vpsId]);

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (!backupsData) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No hay datos de backups disponibles.
      </p>
    );
  }

  const { settings, backups, total } = backupsData;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Total
          </p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            {total}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            backups registrados
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Estado servicio
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
              settings?.enabled
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {settings?.enabled ? "Activo" : "Desactivado"}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Hora programada
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {settings ? formatHour(settings.schedule_hour) : "-"}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            retencion {settings ? `${settings.retention_days} dias` : "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Max backups
          </p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            {settings ? settings.max_backups : "-"}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            limite configurado
          </p>
        </div>
      </div>

      {/* Backup list */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Lista de backups
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {total} {total === 1 ? "registro" : "registros"} encontrados
          </p>
        </div>

        {backups.length === 0 ? (
          <p className="p-5 text-sm text-zinc-500 dark:text-zinc-400">
            No hay backups registrados para esta VPS.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {backups.map((backup) => (
              <li key={backup.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {backup.backup_type ?? "Backup manual"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(backup.status)}`}
                      >
                        {formatStatus(backup.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {backup.backup_volid}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                    #{backup.id}
                  </span>
                </div>

                <div className="mt-3 grid gap-x-6 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 sm:grid-cols-2 lg:grid-cols-3">
                  <span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Tamano:{" "}
                    </span>
                    {backup.size_gb} GB
                  </span>
                  <span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Progreso:{" "}
                    </span>
                    {backup.progress}%
                  </span>
                  <span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Storage:{" "}
                    </span>
                    {backup.pbs_storage}
                  </span>
                  <span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Inicio:{" "}
                    </span>
                    {formatDate(backup.started_at)}
                  </span>
                  <span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Fin:{" "}
                    </span>
                    {formatDate(backup.completed_at)}
                  </span>
                  <span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Creado:{" "}
                    </span>
                    {formatDate(backup.created_at)}
                  </span>
                </div>

                {backup.notes && (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Notas:{" "}
                    </span>
                    {backup.notes}
                  </p>
                )}

                {backup.error_message && (
                  <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                    <span className="font-medium">Error: </span>
                    {backup.error_message}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
