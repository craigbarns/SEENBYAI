import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SeenByAI — Mesurez votre visibilité dans les réponses IA",
    template: "%s | SeenByAI",
  },
  description:
    "Découvrez si ChatGPT, Claude et Perplexity recommandent votre entreprise, puis obtenez un plan d’action priorisé.",
  openGraph: {
    title: "SeenByAI — Votre entreprise est-elle visible dans les IA ?",
    description:
      "Mesurez votre visibilité dans ChatGPT, Claude et Perplexity en quelques minutes.",
    locale: "fr_FR",
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
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <a className="skip-link" href="#main-content">
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
