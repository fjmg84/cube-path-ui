"use client";

import LoadingSection from "@/components/loading-section";
import { VpsCard } from "@/components/vps/vps-card";
import type { VPS } from "@/types/vps";
import NotFoundComponent from "../not-found";
import NotFoundApiKeyComponent from "../not-found-api-key";
import ErrorComponent from "../error";
import useFetch from "@/hooks/useFetch";

function ListAllVPS() {
  const { loading, error, data: vpsList, apiKey } = useFetch<VPS[]>("/api/vps");

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!apiKey) {
    return <NotFoundApiKeyComponent />;
  }

  if (!vpsList || vpsList.length === 0) {
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
