"use client";

import LoadingSection from "@/components/loading-section";
import { VpsCard } from "@/components/vps-card";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import type { VPS } from "@/types/vps";
import { useEffect, useState } from "react";

function ListAllVPS() {
  const [vpsList, setVpsList] = useState<VPS[]>([]);
  const { apiKey } = useApiKeyStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiKey) {
      (async () => {
        setLoading(true);

        try {
          const response = await fetch("/api/vps/all", {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setVpsList(data || []);
          } else {
            console.error("Error fetching VPS data:", response.statusText);
            setVpsList([]);
          }
        } catch (error) {
          console.error("Error fetching VPS data:", error);
          setVpsList([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [apiKey]);

  if (loading) {
    return <LoadingSection />;
  }

  if (vpsList.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        No hay VPS disponibles.
      </p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-4">
      {vpsList.map((vps) => (
        <li key={vps.id}>
          <VpsCard vps={vps} />
        </li>
      ))}
    </ul>
  );
}

export default ListAllVPS;
