import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Sparkles, TrendingUp, Zap } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getIndustry, industries } from "@/lib/industries";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    alternates: { canonical: `/ai-seo-for/${industry.slug}` },
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      type: "article",
      url: `${SITE_URL}/ai-seo-for/${industry.slug}`,
      siteName: SITE_NAME,
    },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

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
          {
            "@type": "ListItem",
            "position": 3,
            "name": industry.name,
            "item": `${SITE_URL}/ai-seo-for/${industry.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        "headline": industry.metaTitle,
        "description": industry.metaDescription,
        "mainEntityOfPage": `${SITE_URL}/ai-seo-for/${industry.slug}`,
        "inLanguage": "en-US",
        "author": { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        "publisher": { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        "mainEntity": industry.faq.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        })),
      },
    ],
  };

  const otherIndustries = industries.filter((other) => other.slug !== industry.slug).slice(0, 4);

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

      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/ai-seo-for">
          <ArrowLeft className="size-4" aria-hidden="true" /> All industry playbooks
        </Link>

        <div className="mt-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
            <Sparkles className="size-3.5 text-lime-600" aria-hidden="true" />
            {industry.singularName} Playbook · GEO
          </div>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl">
            How to get your {industry.singularName.toLowerCase()} business recommended by AI.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {industry.heroSubtitle}
          </p>
        </div>

        {/* Highlight Scan Box */}
        <section className="mt-10 rounded-[1.75rem] bg-[#173b35] p-7 text-white shadow-xl shadow-primary/15 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <span className="rounded-full bg-lime-300 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#173b35]">
                Free Scan Available
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                Are you in the AI answer in your city?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                We test 10 realistic {industry.singularName.toLowerCase()} customer queries across ChatGPT, Claude, Gemini, and Perplexity.
              </p>
            </div>
            <Button asChild className="h-13 shrink-0 rounded-full bg-lime-300 px-7 font-extrabold text-[#173b35] hover:bg-lime-200">
              <Link href="/onboarding">Audit my {industry.singularName.toLowerCase()} business <ArrowRight className="ml-2 size-5" aria-hidden="true" /></Link>
            </Button>
          </div>
        </section>

        {/* Real Customer Queries */}
        <section className="mt-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Customer Intent</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">Queries your customers ask AI assistants</h2>
          <p className="mt-3 text-muted-foreground">
            These are typical high-intent questions asked to ChatGPT and Perplexity in the {industry.singularName.toLowerCase()} space:
          </p>
          <div className="mt-6 grid gap-3">
            {industry.sampleQueries.map((query, index) => (
              <div key={index} className="flex items-center gap-3.5 rounded-2xl border border-foreground/10 bg-white p-4 text-sm font-semibold text-foreground shadow-sm">
                <HelpCircle className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>“{query}”</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ranking Factors */}
        <section className="mt-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Signals & Algorithms</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">Key ranking factors for {industry.name}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {industry.rankingFactors.map((factor, index) => (
              <div key={index} className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-lime-100 text-primary">
                  <Zap className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-extrabold">{factor.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{factor.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Steps */}
        <section className="mt-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Optimization Roadmap</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">Action plan to win recommendations</h2>
          <div className="mt-6 space-y-4">
            {industry.actionSteps.map((step, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#173b35] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-extrabold">{step.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 sm:self-auto">
                  <TrendingUp className="size-3.5" aria-hidden="true" />
                  {step.impact}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Schema Blueprint */}
        <section className="mt-14 rounded-3xl border border-foreground/10 bg-[#f3f4ed] p-7 sm:p-9">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Recommended Schema Type
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">Use Schema.org/{industry.schemaType}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Structured data allows ChatGPT search and Perplexity crawlers to extract verified operating hours, phone numbers, and service areas in milliseconds without guesswork.
          </p>
          <div className="mt-5">
            <Link className="text-sm font-extrabold text-emerald-700 hover:underline" href="/guides/localbusiness-schema-ai-visibility">
              Read our full LocalBusiness Schema guide with copy-paste code →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {industry.faq.map((item, index) => (
              <div key={index} className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
                <h3 className="font-extrabold text-foreground">{item.question}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other Industries */}
        <section className="mt-14 border-t border-foreground/10 pt-10">
          <h2 className="text-xl font-extrabold tracking-[-0.03em]">Explore other industry playbooks</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {otherIndustries.map((other) => (
              <Link className="group flex items-center justify-between rounded-2xl border border-foreground/8 bg-white p-4 transition-colors hover:border-primary/30" href={`/ai-seo-for/${other.slug}`} key={other.slug}>
                <span className="text-sm font-bold">{other.name}</span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
