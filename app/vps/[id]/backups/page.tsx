import { BackupList } from "@/components/vps/backup-list";

type BackupsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VpsBackupsPage({ params }: BackupsPageProps) {
  const { id } = await params;

  return <BackupList vpsId={id} />;
}
