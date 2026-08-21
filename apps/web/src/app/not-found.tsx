import Link from "next/link";
import { ArrowRight, BookOpen, SearchX } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-[78vh] items-center bg-[#f8f8f3] px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-3xl text-center">
        <Link className="inline-flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
          <LogoMark className="size-10" />
          <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
        </Link>

        <span className="mx-auto mt-12 flex size-16 items-center justify-center rounded-2xl bg-lime-200 text-primary">
          <SearchX className="size-8" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">404 · Page not found</p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
          This answer isn&apos;t here. Your AI visibility score can be.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          The link may be outdated. Run a free live scan to see whether ChatGPT, Claude, Gemini and Perplexity recommend your business.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-13 rounded-full px-7">
            <Link
              href="/onboarding"
              data-analytics-event="select_content"
              data-analytics-label="not_found_scan"
            >
              Analyze my business <ArrowRight className="ml-2 size-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-13 rounded-full bg-white px-7">
            <Link
              href="/guides"
              data-analytics-event="select_content"
              data-analytics-label="not_found_guides"
            >
              <BookOpen className="mr-2 size-5" aria-hidden="true" /> Browse the guides
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
