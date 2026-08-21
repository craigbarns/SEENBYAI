import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Code2, HelpCircle } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SchemaGeneratorForm } from "@/components/schema-generator-form";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free LocalBusiness Schema Generator for AI SEO (JSON-LD)",
  description:
    "Generate machine-readable LocalBusiness Schema.org JSON-LD markup optimized for ChatGPT, Claude, Gemini, and Perplexity recommendations. 100% Free.",
  alternates: {
    canonical: "/tools/schema-generator",
  },
};

export default function SchemaGeneratorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": `${SITE_URL}/tools/schema-generator`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "LocalBusiness Schema Generator",
            "item": `${SITE_URL}/tools/schema-generator`,
          },
        ],
      },
      {
        "@type": "WebApplication",
        "name": "LocalBusiness Schema Generator for AI SEO",
        "description": "Generate valid JSON-LD schema markup optimized for AI search engines and LLM recommendations.",
        "url": `${SITE_URL}/tools/schema-generator`,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "publisher": { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why is Schema.org structured data essential for AI engines?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When AI models like ChatGPT and Perplexity search the web live, structured data (JSON-LD) provides clear, unambiguous facts about your business name, address, telephone, services, and opening hours without requiring the model to parse messy HTML.",
            },
          },
          {
            "@type": "Question",
            "name": "Where should I place the generated JSON-LD code?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Copy the generated <script> code and paste it inside the <head> or <body> tags of your homepage or global website layout.",
            },
          },
          {
            "@type": "Question",
            "name": "How do I verify if my schema is working?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can test your website using Google's Rich Results Test tool or run a free scan with GetInTheAnswer to see if AI engines accurately cite your business.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
          <Button asChild className="ml-auto rounded-full px-5">
            <Link href="/onboarding">Free AI visibility scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/">
          <ArrowLeft className="size-4" aria-hidden="true" /> Home
        </Link>

        <div className="mt-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
            <Code2 className="size-3.5 text-emerald-600" aria-hidden="true" />
            Free AI SEO Tool · JSON-LD
          </div>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl">
            LocalBusiness Schema Generator for AI Visibility.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Make your local business verifiable by ChatGPT, Claude, Gemini, and Perplexity. Generate clean, copy-paste Schema.org JSON-LD structured data in seconds.
          </p>
        </div>

        {/* Interactive Tool Form */}
        <div className="mt-10">
          <SchemaGeneratorForm />
        </div>

        {/* Informational Section */}
        <section className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-lime-100 text-primary">
              <CheckCircle2 className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-extrabold">Instant Machine Verification</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Large language models prefer recommending businesses whose contact details and service areas are structured in machine-readable format.
            </p>
          </div>

          <div className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-lime-100 text-primary">
              <Code2 className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-extrabold">Valid Schema.org Standard</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Complies 100% with Schema.org and Google Search guidelines for local business rich snippets and entity resolution.
            </p>
          </div>

          <div className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-lime-100 text-primary">
              <HelpCircle className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-extrabold">Boosts AI Answer Citations</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              When an AI agent performs live web search to answer local queries, it quotes verified sources with structured data first.
            </p>
          </div>
        </section>

        {/* Dedicated Scan CTA */}
        <section className="mt-16 rounded-[1.75rem] bg-[#173b35] p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Want to know if ChatGPT already cites your business?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Run an instant AI visibility audit. We test 10 queries across ChatGPT, Claude, Gemini, and Perplexity and show your score.
              </p>
            </div>
            <Button asChild className="h-13 shrink-0 rounded-full bg-lime-300 px-7 font-extrabold text-[#173b35] hover:bg-lime-200">
              <Link href="/onboarding">Run My Free Scan <ArrowRight className="ml-2 size-5" aria-hidden="true" /></Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
