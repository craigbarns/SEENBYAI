import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

function billingCookieName(siteId: string) {
  return `seenbyai_billing_${siteId.replace(/[^a-zA-Z0-9-]/g, "")}`;
}

/**
 * Redirect using a relative Location header.
 *
 * `new URL(path, request.url)` cannot be used here: behind Railway's proxy
 * `request.url` is the container-internal origin (localhost:8080), so an
 * absolute redirect sends the customer to a dead host right after paying.
 * A relative Location is resolved by the browser against the public URL it
 * actually requested, which is correct in every environment.
 */
function redirectTo(path: string) {
  return new NextResponse(null, { status: 303, headers: { Location: path } });
}

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get("site_id");
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!siteId || !sessionId) {
    return redirectTo("/onboarding");
  }

  const dashboardPath = `/dashboard?site_id=${encodeURIComponent(siteId)}`;

  try {
    const confirmationUrl = new URL("/api/checkout/confirm", API_BASE_URL);
    confirmationUrl.searchParams.set("site_id", siteId);
    confirmationUrl.searchParams.set("session_id", sessionId);
    const confirmation = await fetch(confirmationUrl, { cache: "no-store" });
    const data = (await confirmation.json().catch(() => null)) as { unlocked?: boolean } | null;

    if (!confirmation.ok || !data?.unlocked) {
      return redirectTo(`${dashboardPath}&billing_error=confirmation`);
    }

    const response = redirectTo(dashboardPath);
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
    return redirectTo(`${dashboardPath}&billing_error=confirmation`);
  }
}
