"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ManageSubscriptionButtonProps {
  siteId: string;
  className?: string;
}

export function ManageSubscriptionButton({ siteId, className }: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setFailed(false);
    window.gtag?.("event", "manage_subscription", { site_id: siteId });
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: siteId }),
      });
      const data = (await response.json()) as { url?: string };
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // The retry state below gives the user visible feedback.
    }
    setFailed(true);
    setLoading(false);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleClick}
      disabled={loading}
      aria-live="polite"
    >
      {loading ? (
        <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> Opening…</>
      ) : (
        <><CreditCard className="mr-2 size-4" aria-hidden="true" /> {failed ? "Try billing again" : "Manage billing"}</>
      )}
    </Button>
  );
}
