const getMetrics = async (apiKey: string, vpsId?: string | null) => {
  if (!apiKey) {
    return null;
  }
  try {
    const url = vpsId ? `/api/ia-chat?vps_id=${vpsId}` : "/api/ia-chat";

    const resp = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!resp.ok) {
      throw new Error("Failed to fetch VPS metrics");
    }

    const valuesMetrics = await resp.json();
    return valuesMetrics;
  } catch (error) {
    console.error("Error fetching VPS metrics:", error);
    return null;
  }
};

export default getMetrics;
