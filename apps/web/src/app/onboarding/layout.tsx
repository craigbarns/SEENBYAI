import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Visibility Analysis",
  description:
    "Describe your business and get a free AI visibility report: 20 simulated customer questions across ChatGPT, Claude and Perplexity, with recommendations ranked by impact.",
  alternates: {
    canonical: "/onboarding",
  },
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
