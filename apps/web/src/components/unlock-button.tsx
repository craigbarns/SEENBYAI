"use client";

import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UnlockButtonProps {
  siteId: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  children: React.ReactNode;
}

function readGaClientId(): string | null {
  // The GA cookie looks like "GA1.1.<client_id_part1>.<client_id_part2>";
  // the client_id GA4's Measurement Protocol expects is the last two segments.
  const match = document.cookie.match(/(?:^|; )_ga=([^;]+)/);
  if (!match) return null;
  const parts = decodeURIComponent(match[1]).split(".");
  return parts.length >= 4 ? parts.slice(-2).join(".") : null;
}

export function UnlockButton({ siteId, className, size = "default", variant = "default", children }: UnlockButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    window.gtag?.("event", "begin_checkout", { currency: "USD", value: 29, site_id: siteId });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: siteId, ga_client_id: readGaClientId() }),
      });
      const data = (await response.json()) as { url?: string };
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // fall through to reset the button
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={loading} size={size} variant={variant} className={className}>
      {loading ? (
        <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> Redirecting…</>
      ) : (
        <><LockKeyhole className="mr-2 size-4" aria-hidden="true" /> {children}</>
      )}
    </Button>
  );
}
