const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ message: "Missing Stripe signature" }, { status: 400 });
  }

  try {
    const body = await request.arrayBuffer();
    const response = await fetch(`${API_BASE_URL}/api/stripe/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("content-type") ?? "application/json",
        "Stripe-Signature": signature,
      },
      body,
      cache: "no-store",
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ message: "Webhook service unavailable" }, { status: 502 });
  }
}
