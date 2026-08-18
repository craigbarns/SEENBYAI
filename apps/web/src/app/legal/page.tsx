import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Legal notice",
  description: "Legal and hosting information for GetInTheAnswer.",
  alternates: { canonical: "/legal" },
};

export default function LegalNoticePage() {
  return (
    <LegalPage
      eyebrow="Company information"
      title="Legal notice"
      intro="The legal identity, publisher and hosting information behind GetInTheAnswer."
    >
      <section>
        <h2>Website publisher</h2>
        <p className="mt-3">
          GetInTheAnswer is published and operated by WEMADE, a French single-member simplified joint-stock company (SASU) with share capital of €100.
        </p>
        <ul className="mt-4">
          <li>Registered office: 41 rue Fongate, 13006 Marseille, France</li>
          <li>SIREN: 832 419 428</li>
          <li>Registered establishment (SIRET): 832 419 428 00038</li>
          <li>Marseille Trade and Companies Register: 832 419 428 R.C.S. Marseille</li>
          <li>EU VAT number: FR86832419428</li>
          <li>LEI: 254900MZUV9FJ6IOAK26</li>
          <li>Email: <a href="mailto:gregory@wemade.fr">gregory@wemade.fr</a></li>
          <li>Telephone: <a href="tel:+33484890934">+33 4 84 89 09 34</a></li>
        </ul>
      </section>

      <section>
        <h2>Publication director</h2>
        <p className="mt-3">Gregory Baranes, President of WEMADE.</p>
      </section>

      <section>
        <h2>Hosting provider</h2>
        <p className="mt-3">
          Railway Corporation, 548 Market St, Suite 68956, San Francisco, California 94104, United States. Telephone: +1 415 707 7675. Website:{" "}
          <a href="https://railway.com" rel="noreferrer" target="_blank">railway.com</a>.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p className="mt-3">
          The GetInTheAnswer name, interface, copy, reports and original materials are protected by applicable intellectual-property law. No reproduction or commercial reuse is permitted without prior written authorization from WEMADE, except where the law expressly allows it.
        </p>
      </section>
    </LegalPage>
  );
}
