import Link from "next/link";

import { LogoMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/8 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <Link className="flex items-center gap-2 font-extrabold" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-8" />
            GetInTheAnswer
          </Link>
          <p className="text-sm text-muted-foreground md:ml-3">© 2026 WEMADE. AI visibility, made actionable.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-muted-foreground md:ml-auto" aria-label="Footer navigation">
            <Link className="hover:text-foreground" href="/guides">Guides</Link>
            <Link className="hover:text-foreground" href="/onboarding">Run a scan</Link>
            <Link className="hover:text-foreground" href="/legal">Legal</Link>
            <Link className="hover:text-foreground" href="/privacy">Privacy</Link>
            <Link className="hover:text-foreground" href="/terms">Terms</Link>
          </nav>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          GetInTheAnswer is operated by WEMADE, SASU registered with the Marseille Trade and Companies Register under number 832 419 428.
        </p>
      </div>
    </footer>
  );
}
