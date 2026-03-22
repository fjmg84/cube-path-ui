import { NextResponse } from "next/server";

const URL_CUBE_PATH = process.env.URL_CUBE_PATH;

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

  const responseVps = await fetch(`${URL_CUBE_PATH}/vps/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: authorization,
    },
    cache: "no-store",
  });

  if (!responseVps.ok) {
    return NextResponse.json(
      {
        error: "Failed to fetch VPS data",
        status: responseVps.status,
        statusText: responseVps.statusText,
      },
      { status: responseVps.status },
    );
  }

  const vpsData = await responseVps.json();
  const vpsId = vpsData?.map((vps: { id: number }) => vps.id) || null;

  try {
    const response = vpsId.map(
      async (id: number) =>
        await fetch(`${URL_CUBE_PATH}/vps/${id}/metrics?time_range=7d`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: authorization,
          },
          cache: "no-store",
        }),
    );

    const resolvedResponses = await Promise.all(response);

    const data = await Promise.all(resolvedResponses.map((res) => res.json()));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching IA analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch IA analytics data" },
      { status: 500 },
    );
  }
}
