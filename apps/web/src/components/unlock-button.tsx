"use client";

import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UnlockButtonProps {
  siteId: string;
  placement?: string;
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

export function UnlockButton({
  siteId,
  placement = "unknown",
  className,
  size = "default",
  variant = "default",
  children,
}: UnlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = `checkout-error-${placement.replace(/[^a-zA-Z0-9-]/g, "-")}`;

  const handleClick = async () => {
    setError(null);
    setLoading(true);
    window.gtag?.("event", "begin_checkout", {
      currency: "USD",
      value: 29,
      site_id: siteId,
      checkout_placement: placement,
      items: [
        {
          item_id: "pro_monthly",
          item_name: "GetInTheAnswer Pro Monitoring",
          price: 29,
          quantity: 1,
        },
      ],
    });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: siteId, ga_client_id: readGaClientId() }),
      });
      const data = (await response.json()) as { url?: string; message?: string };
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      window.gtag?.("event", "checkout_error", {
        checkout_placement: placement,
        status_code: response.status,
      });
      setError(data.message ?? "Checkout couldn't open. Please try again in a moment.");
    } catch {
      window.gtag?.("event", "checkout_error", {
        checkout_placement: placement,
        status_code: 0,
      });
      setError("Checkout couldn't open. Please check your connection and try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={loading}
        size={size}
        variant={variant}
        className={className}
        aria-describedby={error ? errorId : undefined}
      >
        {loading ? (
          <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> Redirecting…</>
        ) : (
          <><LockKeyhole className="mr-2 size-4" aria-hidden="true" /> {children}</>
        )}
      </Button>
      {error && (
        <span id={errorId} className="mt-2 block max-w-sm text-xs font-semibold leading-5 text-red-700" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
