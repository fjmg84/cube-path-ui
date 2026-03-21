import MetricsVPS from "@/components/vps/metrics/metrics-vps";

type VpsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VpsDetailPage({ params }: VpsDetailPageProps) {
  const { id } = await params;

  return <MetricsVPS vpsId={id} />;
}
