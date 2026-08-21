"use client";

import { useEffect } from "react";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";

import { UnlockButton } from "@/components/unlock-button";

type BillingStatus = "cancelled" | "confirmation_error" | "success";

interface BillingStatusBannerProps {
  siteId: string;
  status: BillingStatus;
}

const content: Record<BillingStatus, { event: string; title: string; copy: string }> = {
  cancelled: {
    event: "checkout_cancelled",
    title: "Checkout cancelled — nothing was charged.",
    copy: "Your report preview is still here. You can unlock it whenever you're ready.",
  },
  confirmation_error: {
    event: "checkout_confirmation_failed",
    title: "We couldn't confirm the payment yet.",
    copy: "If Stripe charged you, refresh this page in a moment. Otherwise, you can safely try again.",
  },
  success: {
    event: "checkout_confirmed",
    title: "Your full report is unlocked.",
    copy: "Every answer and recommendation is now visible, and weekly monitoring is active.",
  },
};

export function BillingStatusBanner({ siteId, status }: BillingStatusBannerProps) {
  const details = content[status];

  useEffect(() => {
    const storageKey = `seenbyai_${details.event}_${siteId}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    window.gtag?.("event", details.event, { site_id: siteId });
    window.sessionStorage.setItem(storageKey, "1");
  }, [details.event, siteId]);

  const isSuccess = status === "success";
  const Icon = isSuccess ? CheckCircle2 : status === "cancelled" ? XCircle : CircleAlert;

  return (
    <section
      className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : "border-amber-200 bg-amber-50 text-amber-950"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${isSuccess ? "text-emerald-700" : "text-amber-700"}`} aria-hidden="true" />
        <div>
          <h2 className="font-extrabold">{details.title}</h2>
          <p className="mt-1 text-sm leading-6 opacity-75">{details.copy}</p>
        </div>
      </div>
      {!isSuccess && (
        <UnlockButton
          siteId={siteId}
          placement={`checkout_${status}`}
          size="sm"
          className="shrink-0 rounded-full px-5"
        >
          Try checkout again — $29/mo
        </UnlockButton>
      )}
    </section>
  );
}
