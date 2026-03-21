import BandwidthUsage from "@/components/vps/bandwidth/bandwidth-usage";

type BandwidthUsagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function BandwidthUsagePage({
  params,
}: BandwidthUsagePageProps) {
  const { id } = await params;

  return <BandwidthUsage vpsId={id} />;
}
