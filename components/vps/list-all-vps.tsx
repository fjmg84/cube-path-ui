"use client";

import { VpsCard } from "@/components/vps/vps-card";
import type { VPS } from "@/types/vps";
import useFetch from "@/hooks/useFetch";
import DisplayErrors from "../display-errors";

function ListAllVPS() {
  const { loading, error, data: vpsList } = useFetch<VPS[]>("/api/vps");

  if (loading || error || !vpsList)
    return (
      <DisplayErrors<VPS[]> loading={loading} error={error} data={vpsList} />
    );

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
