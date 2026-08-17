import { NextResponse } from "next/server";

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(`${API_BASE_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Checkout is unavailable right now. Please try again in a moment.", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Checkout is unavailable right now. Please try again in a moment." },
      { status: 502 },
    );
  }
}
