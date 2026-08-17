import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "AI Visibility Guides — GEO & AI SEO for Local Businesses",
  description:
    "Practical guides on generative engine optimization (GEO): how to get recommended by ChatGPT, AI SEO playbooks and structured data for local businesses.",
  alternates: {
    canonical: "/guides",
  },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="LLM Rank, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">LLM Rank</span>
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
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Guides</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Get found by AI engines.</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Practical, no-fluff guides on generative engine optimization for local businesses — how ChatGPT, Claude and Perplexity pick who to recommend, and how to become that recommendation.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {guides.map((guide) => (
            <Link
              className="group flex flex-col rounded-[1.5rem] border border-foreground/8 bg-white p-7 shadow-sm transition-transform hover:-translate-y-1"
              href={`/guides/${guide.slug}`}
              key={guide.slug}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-lime-200 text-primary">
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-extrabold leading-7 tracking-[-0.025em]">{guide.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{guide.description}</p>
              <span className="mt-5 flex items-center gap-1.5 text-sm font-extrabold text-emerald-700">
                Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                <span className="ml-auto font-semibold text-muted-foreground">{guide.readingMinutes} min</span>
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-14 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-[#173b35] p-7 text-white sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.035em]">Reading is good. Measuring is better.</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">Run a free scan and see exactly how visible your business is in AI answers today.</p>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-full bg-lime-300 px-6 font-extrabold text-[#173b35] hover:bg-lime-200">
            <Link href="/onboarding">Get my free scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
