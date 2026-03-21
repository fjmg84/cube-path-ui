import type { VPS } from "@/types/vps";

export type Project = {
  id: number;
  name: string;
  description: string;
};

export type ProjectEntry = {
  project: Project;
  networks: unknown[];
  baremetals: unknown[];
  vps: VPS[];
};
