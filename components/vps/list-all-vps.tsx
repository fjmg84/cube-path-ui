"use client";

import LoadingSection from "@/components/loading-section";
import { VpsCard } from "@/components/vps/vps-card";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import type { VPS } from "@/types/vps";
import { useEffect, useState } from "react";
import NotFoundComponent from "../not-found";
import NotFoundApiKeyComponent from "../not-found-api-key";
import ErrorComponent from "../error";

function ListAllVPS() {
  const [vpsList, setVpsList] = useState<VPS[]>([]);
  const { apiKey } = useApiKeyStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setVpsList([]);
      setLoading(false);
      setError(null);
      return;
    }

    (async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/vps", {
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
          setError(response.statusText || "No se pudieron cargar los VPS");
          setVpsList([]);
        }
      } catch (error) {
        console.error("Error fetching VPS data:", error);
        setError("No se pudieron cargar los VPS.");
        setVpsList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiKey]);

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!apiKey) {
    return <NotFoundApiKeyComponent />;
  }

  if (vpsList.length === 0) {
    return <NotFoundComponent />;
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
