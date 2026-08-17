import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SeenByAI — Measure your visibility in AI answers",
    template: "%s | SeenByAI",
  },
  description:
    "Find out whether ChatGPT, Claude and Perplexity recommend your business, then get a prioritized action plan.",
  openGraph: {
    title: "SeenByAI — Is your business visible in AI answers?",
    description:
      "Measure your visibility in ChatGPT, Claude and Perplexity in minutes.",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#173b35",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
