import { NextResponse } from "next/server";

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8001";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(`${API_BASE_URL}/api/onboarding`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Les informations fournies ne permettent pas de lancer l’analyse.", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Le service d’analyse est momentanément indisponible. Réessayez dans quelques instants." },
      { status: 502 },
    );
  }
}
