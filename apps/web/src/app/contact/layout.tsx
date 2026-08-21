import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency & Multi-location",
  description:
    "Get an AI visibility monitoring plan for agencies and multi-location businesses, with white-label reports and city-level competitor tracking.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
