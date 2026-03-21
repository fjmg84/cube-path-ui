export type IncidentUpdate = {
  id: number;
  message: string;
  status: string;
  created_at: string;
};

export type Incident = {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | string;
  status: string;
  location_name: string;
  affected_services: string[] | null;
  started_at: string;
  resolved_at: string | null;
  updates: IncidentUpdate[];
};
