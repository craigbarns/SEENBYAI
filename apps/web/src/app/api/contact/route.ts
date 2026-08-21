import { NextResponse } from "next/server";

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

function getClientIp(request: Request) {
  const directIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip");
  if (directIp) return directIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-IP": getClientIp(request),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "We couldn't send your request right now. Please try again in a moment." },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "The contact service is temporarily unavailable. Please try again in a moment." },
      { status: 502 },
    );
  }
}
