import { NextResponse } from "next/server";

const URL_CUBE_PATH = process.env.URL_CUBE_PATH;

type Endpoint = "backups" | "metrics" | "none";

const ENDPOINTS: Record<Endpoint, string> = {
  none: "",
  backups: "/backups",
  metrics: "/metrics",
};

export async function GET(request: Request) {
  if (!URL_CUBE_PATH) {
    return NextResponse.json(
      { error: "Missing URL_CUBE_PATH environment variable" },
      { status: 500 },
    );
  }

  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 400 },
    );
  }

  const vpsId = new URL(request.url).searchParams.get("vps_id");
  const backups = new URL(request.url).searchParams.get("backups");
  const metrics = new URL(request.url).searchParams.get("metrics");

  if ((backups || metrics) && !vpsId) {
    return NextResponse.json(
      { error: "Missing vps_id query parameter" },
      { status: 400 },
    );
  }

  const endpoint: Endpoint = backups ? "backups" : metrics ? "metrics" : "none";
  const vpsIdPart = vpsId ? `/${vpsId}` : "/";

  const url = `${URL_CUBE_PATH}/vps${vpsIdPart}${ENDPOINTS[endpoint]}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: authorization,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch VPS backups",
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching VPS backups:", error);
    return NextResponse.json(
      { error: "Failed to fetch VPS backups" },
      { status: 500 },
    );
  }
}
