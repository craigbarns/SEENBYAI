"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareScoreButtonProps {
  companyName: string;
  score: number;
  city: string;
  siteId: string;
}

export function ShareScoreButton({ companyName, score, city, siteId }: ShareScoreButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const reportUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard?site_id=${encodeURIComponent(siteId)}` : `https://www.getintheanswer.com/dashboard?site_id=${encodeURIComponent(siteId)}`;

  const shareText = `We tested how visible ${companyName} (${city}) is across ChatGPT, Claude & Perplexity with @GetInTheAnswer. Our AI Visibility Score is ${score}/100! 🚀 Check your local AI ranking:`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(reportUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(reportUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        size="sm"
        className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
      >
        <Share2 className="mr-1.5 size-3.5" />
        Share Score
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-foreground/10 bg-white p-3 text-foreground shadow-2xl">
          <p className="px-2 py-1 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Share Your Results
          </p>
          <div className="mt-2 space-y-1.5">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors hover:bg-[#f8f8f3]"
            >
              <span>Share on LinkedIn</span>
              <span className="text-[10px] text-muted-foreground">↗</span>
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors hover:bg-[#f8f8f3]"
            >
              <span>Share on X / Twitter</span>
              <span className="text-[10px] text-muted-foreground">↗</span>
            </a>
            <button
              onClick={handleCopy}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-[#f8f8f3]"
            >
              <span>{copied ? "Link Copied!" : "Copy Report Link"}</span>
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3 text-muted-foreground" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
