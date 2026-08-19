import type { Metadata, Viewport } from "next";
import "./globals.css";

import Script from "next/script";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { GA_MEASUREMENT_ID, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GetInTheAnswer — Is Your Business Recommended by ChatGPT, Claude & Perplexity?",
    template: "%s | GetInTheAnswer",
  },
  description:
    "Check if AI engines like ChatGPT, Claude, Gemini and Perplexity recommend your local business. Get your free AI visibility score, competitor benchmark and prioritized action plan in minutes.",
  keywords: [
    "AI visibility",
    "AI SEO",
    "generative engine optimization",
    "GEO",
    "ChatGPT recommendations",
    "AI search optimization",
    "local business visibility",
    "AI visibility score",
    "LLM SEO",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "GetInTheAnswer — Is your business visible in AI answers?",
    description:
      "Measure your visibility in ChatGPT, Claude, Gemini and Perplexity in minutes. Free AI visibility score, no credit card required.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetInTheAnswer — Is your business visible in AI answers?",
    description:
      "Measure your visibility in ChatGPT, Claude, Gemini and Perplexity in minutes. Free AI visibility score, no credit card required.",
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#173b35",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <SiteFooter />
        <Analytics />
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
