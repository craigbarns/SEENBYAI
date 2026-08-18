import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getGuide, guides } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      type: "article",
      url: `${SITE_URL}/guides/${guide.slug}`,
      siteName: SITE_NAME,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

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
            "name": "Guides",
            "item": `${SITE_URL}/guides`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": guide.title,
            "item": `${SITE_URL}/guides/${guide.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        "headline": guide.title,
        "description": guide.description,
        "datePublished": guide.datePublished,
        "dateModified": guide.datePublished,
        "mainEntityOfPage": `${SITE_URL}/guides/${guide.slug}`,
        "inLanguage": "en-US",
        "author": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
        "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
      },
    ],
  };

  const otherGuides = guides.filter((other) => other.slug !== guide.slug).slice(0, 3);

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

      <main id="main-content" className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/guides">
          <ArrowLeft className="size-4" aria-hidden="true" /> All guides
        </Link>

        <article className="mt-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Guide · {guide.readingMinutes} min read</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-5xl">{guide.title}</h1>

          <div className="mt-8 space-y-5">
            {guide.intro.map((paragraph, index) => (
              <p className="text-lg leading-8 text-foreground/80" key={index}>{paragraph}</p>
            ))}
          </div>

          {guide.sections.map((section) => (
            <section className="mt-12" key={section.heading}>
              <h2 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph, index) => (
                  <p className="leading-8 text-foreground/80" key={index}>{paragraph}</p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-5 space-y-3">
                  {section.list.map((item) => (
                    <li className="flex items-start gap-3 leading-7 text-foreground/80" key={item}>
                      <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-lime-300 text-[#173b35]">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <section className="mt-14 rounded-[1.75rem] bg-[#173b35] p-7 text-white sm:p-9">
          <h2 className="text-2xl font-extrabold tracking-[-0.035em]">How visible is your business in AI answers?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
            Find out in minutes: GetInTheAnswer asks the real questions your customers ask ChatGPT, Claude and Perplexity, and scores your visibility against your competitors. Free, no credit card.
          </p>
          <Button asChild className="mt-6 h-12 rounded-full bg-lime-300 px-6 font-extrabold text-[#173b35] hover:bg-lime-200">
            <Link href="/onboarding">Run my free scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
          </Button>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-[-0.03em]">Keep reading</h2>
          <div className="mt-5 grid gap-4">
            {otherGuides.map((other) => (
              <Link className="group flex items-center justify-between gap-4 rounded-2xl border border-foreground/8 bg-white p-5 transition-colors hover:border-primary/25" href={`/guides/${other.slug}`} key={other.slug}>
                <span className="font-bold leading-6">{other.title}</span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
