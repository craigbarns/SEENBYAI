import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

function billingCookieName(siteId: string) {
  return `seenbyai_billing_${siteId.replace(/[^a-zA-Z0-9-]/g, "")}`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { site_id?: unknown };
    if (typeof payload.site_id !== "string") {
      return NextResponse.json({ message: "Invalid report." }, { status: 400 });
    }

    const checkoutSessionId = request.cookies.get(billingCookieName(payload.site_id))?.value;
    if (!checkoutSessionId) {
      return NextResponse.json(
        { message: "Billing access must be opened from the browser used to subscribe." },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/billing/portal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site_id: payload.site_id,
        checkout_session_id: checkoutSessionId,
      }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: "The subscription portal is unavailable right now.", details: data },
        { status: response.status },
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "The subscription portal is unavailable right now." },
      { status: 502 },
    );
  }
}
