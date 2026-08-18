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
    const response = await fetch(`${API_BASE_URL}/api/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-IP": getClientIp(request),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: "We couldn't start the analysis with the information provided.", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "The analysis service is temporarily unavailable. Please try again in a moment." },
      { status: 502 },
    );
  }
}
