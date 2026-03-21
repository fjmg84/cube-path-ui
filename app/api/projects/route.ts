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

  const url = `${URL_CUBE_PATH}/projects/`;

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
          error: "Failed to fetch projects data",
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects data" },
      { status: 500 },
    );
  }
}
