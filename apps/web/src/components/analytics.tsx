"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

import { GA_MEASUREMENT_ID } from "@/lib/site";

type Consent = "accepted" | "rejected" | null;

const CONSENT_KEY = "seenbyai_analytics_consent";

export function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const saved = window.localStorage.getItem(CONSENT_KEY);
      setConsent(saved === "accepted" || saved === "rejected" ? saved : null);
      setReady(true);
    });

    const reopenPreferences = () => setConsent(null);
    window.addEventListener("seenbyai:cookie-preferences", reopenPreferences);
    return () => {
      active = false;
      window.removeEventListener("seenbyai:cookie-preferences", reopenPreferences);
    };
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    if (value === "rejected") {
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      setAnalyticsReady(false);
    }
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  useEffect(() => {
    if (consent !== "accepted" || !analyticsReady || !window.gtag) return;

    const trackAnnotatedClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-analytics-event]")
        : null;
      if (!target) return;

      const eventName = target.dataset.analyticsEvent;
      if (!eventName) return;

      window.gtag?.("event", eventName, {
        content_type: target.dataset.analyticsType ?? "cta",
        item_id: target.dataset.analyticsLabel ?? "unknown",
        link_url: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    };

    document.addEventListener("click", trackAnnotatedClick);
    return () => document.removeEventListener("click", trackAnnotatedClick);
  }, [analyticsReady, consent]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script id="google-analytics-consent" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
            onReady={() => setAnalyticsReady(true)}
          />
        </>
      )}

      {ready && consent === null && (
        <aside
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-foreground/10 bg-white p-5 shadow-2xl shadow-primary/15 sm:flex sm:items-center sm:gap-6"
          role="dialog"
          aria-label="Analytics cookie preferences"
          aria-live="polite"
        >
          <div className="flex-1">
            <p className="font-extrabold">Help us improve GetInTheAnswer?</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              We use optional Google Analytics cookies only with your permission. Essential cookies still work if you decline. Read our{" "}
              <Link className="font-bold text-emerald-700 underline" href="/privacy">privacy policy</Link>.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-0 sm:shrink-0">
            <button
              className="h-10 rounded-full border border-foreground/15 px-4 text-sm font-extrabold hover:bg-foreground/5"
              type="button"
              onClick={() => choose("rejected")}
            >
              Decline
            </button>
            <button
              className="h-10 rounded-full bg-primary px-4 text-sm font-extrabold text-primary-foreground hover:bg-primary/90"
              type="button"
              onClick={() => choose("accepted")}
            >
              Accept
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
