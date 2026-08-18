import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, HelpCircle, MapPin, Zap } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cities, getCity } from "@/lib/cities";
import { getIndustry, industries } from "@/lib/industries";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  const params: { slug: string; city: string }[] = [];
  for (const industry of industries) {
    for (const city of cities) {
      params.push({ slug: industry.slug, city: city.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; city: string }>;
}): Promise<Metadata> {
  const { slug, city: citySlug } = await params;
  const industry = getIndustry(slug);
  const city = getCity(citySlug);
  if (!industry || !city) return {};

  const title = `AI SEO for ${industry.name} in ${city.name}, ${city.stateCode} — Get Recommended by ChatGPT`;
  const description = `Discover how ${industry.name.toLowerCase()} in ${city.name}, ${city.stateCode} can rank in ChatGPT, Claude, Gemini, and Perplexity local recommendations. Free AI scan.`;

  return {
    title,
    description,
    alternates: { canonical: `/ai-seo-for/${industry.slug}/${city.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/ai-seo-for/${industry.slug}/${city.slug}`,
      siteName: SITE_NAME,
    },
  };
}

export default async function IndustryCityPage({
  params,
}: {
  params: Promise<{ slug: string; city: string }>;
}) {
  const { slug, city: citySlug } = await params;
  const industry = getIndustry(slug);
  const city = getCity(citySlug);
  if (!industry || !city) notFound();

  const formattedCity = `${city.name}, ${city.stateCode}`;
  const localizedQueries = industry.sampleQueries.map((q) => q.replace(/\{city\}/g, formattedCity));

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
          {
            "@type": "ListItem",
            "position": 4,
            "name": formattedCity,
            "item": `${SITE_URL}/ai-seo-for/${industry.slug}/${city.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        "headline": `AI SEO for ${industry.name} in ${formattedCity}`,
        "description": `How ${industry.name.toLowerCase()} in ${formattedCity} can get recommended by ChatGPT, Claude, and Perplexity.`,
        "mainEntityOfPage": `${SITE_URL}/ai-seo-for/${industry.slug}/${city.slug}`,
        "inLanguage": "en-US",
        "author": { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        "publisher": { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        "mainEntity": industry.faq.map((item) => ({
          "@type": "Question",
          "name": item.question.replace(/\{city\}/g, formattedCity),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer.replace(/\{city\}/g, formattedCity),
          },
        })),
      },
    ],
  };

  const otherCities = cities.filter((c) => c.slug !== city.slug).slice(0, 5);

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
            <Link href={`/onboarding?city=${encodeURIComponent(formattedCity)}&industry=${encodeURIComponent(industry.singularName)}`}>
              Free AI visibility scan <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link className="hover:text-foreground" href="/ai-seo-for">All industries</Link>
          <span>/</span>
          <Link className="hover:text-foreground" href={`/ai-seo-for/${industry.slug}`}>{industry.name}</Link>
          <span>/</span>
          <span className="text-foreground">{formattedCity}</span>
        </div>

        <div className="mt-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
            <MapPin className="size-3.5 text-emerald-600" aria-hidden="true" />
            {formattedCity} · {industry.singularName} AI SEO
          </div>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl">
            When {formattedCity} residents ask an AI for a {industry.singularName.toLowerCase()}, are you in the answer?
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Learn how top {industry.name.toLowerCase()} in {formattedCity} capture high-intent leads directly from ChatGPT, Claude, and Perplexity answers.
          </p>
        </div>

        {/* Localized Scan Card */}
        <section className="mt-10 rounded-[1.75rem] bg-[#173b35] p-7 text-white shadow-xl shadow-primary/15 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <span className="rounded-full bg-lime-300 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#173b35]">
                {formattedCity} Live Audit
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                Benchmark your {industry.singularName.toLowerCase()} business in {city.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                We test real local queries in {formattedCity} and reveal which competitor ChatGPT recommends over you.
              </p>
            </div>
            <Button asChild className="h-13 shrink-0 rounded-full bg-lime-300 px-7 font-extrabold text-[#173b35] hover:bg-lime-200">
              <Link href={`/onboarding?city=${encodeURIComponent(formattedCity)}&industry=${encodeURIComponent(industry.singularName)}`}>
                Run {city.name} Scan <ArrowRight className="ml-2 size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Local Queries */}
        <section className="mt-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Real Local Queries</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">What customers in {formattedCity} ask AI engines</h2>
          <div className="mt-6 grid gap-3">
            {localizedQueries.map((query, index) => (
              <div key={index} className="flex items-center gap-3.5 rounded-2xl border border-foreground/10 bg-white p-4 text-sm font-semibold text-foreground shadow-sm">
                <HelpCircle className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>“{query}”</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ranking Factors */}
        <section className="mt-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Local Authority</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">How to dominate AI search in {city.name}</h2>
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

        {/* Localized Schema Box */}
        <section className="mt-14 rounded-3xl border border-foreground/10 bg-[#f3f4ed] p-7 sm:p-9">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Structured Data Blueprint for {formattedCity}
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">Schema.org/{industry.schemaType} for {city.name}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Set your <code className="rounded bg-white px-1.5 py-0.5 text-xs font-bold">addressLocality</code> to &quot;{city.name}&quot; and <code className="rounded bg-white px-1.5 py-0.5 text-xs font-bold">addressRegion</code> to &quot;{city.stateCode}&quot;. Ensure your phone number matches your Google Business Profile.
          </p>
          <div className="mt-5 flex gap-4">
            <Link className="text-sm font-extrabold text-emerald-700 hover:underline" href="/tools/schema-generator">
              Generate free schema with our tool →
            </Link>
          </div>
        </section>

        {/* Other Cities */}
        <section className="mt-14 border-t border-foreground/10 pt-10">
          <h2 className="text-xl font-extrabold tracking-[-0.03em]">Explore {industry.name} in other US cities</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {otherCities.map((otherCity) => (
              <Link
                className="group flex items-center justify-between rounded-2xl border border-foreground/8 bg-white p-4 transition-colors hover:border-primary/30"
                href={`/ai-seo-for/${industry.slug}/${otherCity.slug}`}
                key={otherCity.slug}
              >
                <span className="text-sm font-bold">{industry.singularName} in {otherCity.name}, {otherCity.stateCode}</span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
