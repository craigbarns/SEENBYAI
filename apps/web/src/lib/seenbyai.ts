import "server-only";

export type Priority = "high" | "medium" | "low";

export interface QueryResult {
  query: string;
  engine: string;
  brand_mentioned: boolean;
  competitors_detected: string[];
  confidence: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: Priority;
  estimated_impact: "high" | "medium" | "low";
}

export interface DashboardData {
  site_id: string;
  company_name: string;
  website_url: string;
  city: string;
  industry: string;
  visibility_score: number;
  total_queries: number;
  brand_mentions: number;
  top_competitor: string;
  top_competitor_mentions: number;
  queries: QueryResult[];
  recommendations: Recommendation[];
  mode: "live" | "simulation";
  unlocked: boolean;
}

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

export async function confirmCheckout(siteId: string, sessionId: string): Promise<void> {
  try {
    await fetch(
      `${API_BASE_URL}/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}&site_id=${encodeURIComponent(siteId)}`,
      { cache: "no-store" },
    );
  } catch {
    // Payment confirmation is retried on the next page load.
  }
}

export async function getDashboardData(siteId: string): Promise<DashboardData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/${encodeURIComponent(siteId)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as DashboardData;
  } catch {
    return null;
  }
}
