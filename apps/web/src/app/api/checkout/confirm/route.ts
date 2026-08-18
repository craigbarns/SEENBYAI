import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

function billingCookieName(siteId: string) {
  return `seenbyai_billing_${siteId.replace(/[^a-zA-Z0-9-]/g, "")}`;
}

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get("site_id");
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const dashboardUrl = new URL("/dashboard", request.url);

  if (!siteId || !sessionId) {
    return NextResponse.redirect(new URL("/onboarding", request.url), 303);
  }

  dashboardUrl.searchParams.set("site_id", siteId);

  try {
    const confirmationUrl = new URL("/api/checkout/confirm", API_BASE_URL);
    confirmationUrl.searchParams.set("site_id", siteId);
    confirmationUrl.searchParams.set("session_id", sessionId);
    const confirmation = await fetch(confirmationUrl, { cache: "no-store" });
    const data = (await confirmation.json().catch(() => null)) as { unlocked?: boolean } | null;

    if (!confirmation.ok || !data?.unlocked) {
      dashboardUrl.searchParams.set("billing_error", "confirmation");
      return NextResponse.redirect(dashboardUrl, 303);
    }

    const response = NextResponse.redirect(dashboardUrl, 303);
    response.cookies.set({
      name: billingCookieName(siteId),
      value: sessionId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return response;
  } catch {
    dashboardUrl.searchParams.set("billing_error", "confirmation");
    return NextResponse.redirect(dashboardUrl, 303);
  }
}
