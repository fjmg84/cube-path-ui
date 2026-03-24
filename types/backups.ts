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

export type BackupsResponse = {
  backups: BackupItem[];
  total: number;
  has_settings: boolean;
  settings: BackupSettings | null;
};

export type BackupListProps = {
  vpsId: string;
};
