import Link from "next/link";

import { LogoMark } from "@/components/logo";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}

export function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <main id="main-content" className="min-h-screen bg-[#f8f8f3]">
      <header className="border-b border-foreground/8 bg-white">
        <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link className="flex items-center gap-2 font-extrabold" href="/">
            <LogoMark className="size-9" />
            GetInTheAnswer
          </Link>
          <Link className="text-sm font-bold text-emerald-700 hover:underline" href="/">Back to home</Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-emerald-700">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{intro}</p>
        <p className="mt-3 text-sm font-semibold text-muted-foreground">Last updated: August 18, 2026</p>

        <article className="mt-12 space-y-9 rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-10 [&_a]:font-bold [&_a]:text-emerald-700 [&_a]:underline [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-[-0.035em] [&_li]:leading-7 [&_p]:leading-7 [&_p]:text-muted-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
          {children}
        </article>
      </div>
    </main>
  );
}
