import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { industries } from "@/lib/industries";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI SEO & GEO Playbooks by Industry — GetInTheAnswer",
  description:
    "Explore generative engine optimization playbooks tailored to your industry: Plumbers, Dentists, Lawyers, Real Estate, Restaurants, HVAC and more.",
  alternates: {
    canonical: "/ai-seo-for",
  },
};

export default function IndustriesIndexPage() {
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
            "name": "AI SEO by Industry",
            "item": `${SITE_URL}/ai-seo-for`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "name": "AI SEO & GEO Playbooks by Industry",
        "description":
          "Explore generative engine optimization playbooks tailored to your industry: Plumbers, Dentists, Lawyers, Real Estate, Restaurants, HVAC and more.",
        "url": `${SITE_URL}/ai-seo-for`,
        "publisher": { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
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

      <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/">
          <ArrowLeft className="size-4" aria-hidden="true" /> Home
        </Link>
        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">AI SEO Playbooks</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">AI Visibility by Industry.</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Every profession has unique customer queries, citation sources, and schema requirements. Choose your trade to see how ChatGPT, Claude, and Perplexity pick who to recommend.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {industries.map((industry) => (
            <Link
              className="group flex flex-col rounded-[1.5rem] border border-foreground/8 bg-white p-7 shadow-sm transition-transform hover:-translate-y-1"
              href={`/ai-seo-for/${industry.slug}`}
              key={industry.slug}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-lime-200 text-primary">
                <Briefcase className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-extrabold leading-7 tracking-[-0.025em]">{industry.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{industry.metaDescription}</p>
              <span className="mt-5 flex items-center gap-1.5 text-sm font-extrabold text-emerald-700">
                View industry playbook <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-14 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-[#173b35] p-7 text-white sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.035em]">Don&#39;t see your industry listed?</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">Our scan engine adapts automatically to any local business trade and city.</p>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-full bg-lime-300 px-6 font-extrabold text-[#173b35] hover:bg-lime-200">
            <Link href="/onboarding">Run a custom scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
