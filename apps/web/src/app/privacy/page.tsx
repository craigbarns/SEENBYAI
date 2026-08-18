import type { Metadata } from "next";

import { CookiePreferencesButton } from "@/components/cookie-preferences-button";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How GetInTheAnswer collects, uses and protects personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Your data"
      title="Privacy policy"
      intro="This policy explains what WEMADE collects through GetInTheAnswer, why it is needed and the choices available to you."
    >
      <section>
        <h2>Data controller</h2>
        <p className="mt-3">
          WEMADE, 41 rue Fongate, 13006 Marseille, France, is the controller of personal data processed through GetInTheAnswer. Privacy requests can be sent to{" "}
          <a href="mailto:gregory@wemade.fr">gregory@wemade.fr</a>.
        </p>
      </section>

      <section>
        <h2>Data we process</h2>
        <ul className="mt-4">
          <li>Business profile information: company name, work email, website, city, industry and services.</li>
          <li>Report information: questions, public AI answers, visibility metrics, recommendations and public website audit results.</li>
          <li>Billing references: Stripe customer, checkout and subscription identifiers. WEMADE does not receive full payment-card details.</li>
          <li>Technical information: IP address, request logs, security signals and optional analytics data.</li>
        </ul>
      </section>

      <section>
        <h2>Purposes and legal bases</h2>
        <ul className="mt-4">
          <li>Generate, store and deliver requested reports, and administer subscriptions: steps before entering into a contract and performance of the contract.</li>
          <li>Protect the service, prevent excessive scans and diagnose incidents: WEMADE&apos;s legitimate interests in security and service reliability.</li>
          <li>Meet accounting, tax and legal duties: compliance with legal obligations.</li>
          <li>Measure audience and improve the product through Google Analytics: consent, which can be refused or withdrawn at any time.</li>
        </ul>
      </section>

      <section>
        <h2>Recipients and service providers</h2>
        <p className="mt-3">
          Access is limited to WEMADE and providers needed to operate the service: Railway for hosting, Stripe for payments, and the AI or website-analysis providers made available for a scan, which may include OpenAI, Anthropic, Perplexity and Firecrawl. Google receives analytics data only after consent.
        </p>
        <p className="mt-3">
          Some providers process data in the United States or other countries outside the European Economic Area. These transfers rely on an applicable adequacy decision, the EU–US Data Privacy Framework where available, or European Commission standard contractual clauses.
        </p>
      </section>

      <section>
        <h2>Retention</h2>
        <ul className="mt-4">
          <li>Free reports and their business contact data are retained while the report remains available or until a valid deletion request is completed.</li>
          <li>Paid report data is retained for the subscription relationship and then for the period needed to handle claims and legal obligations.</li>
          <li>Invoices and accounting records are retained for the legally required period.</li>
          <li>Security and technical logs are retained only for the period reasonably needed to investigate incidents and operate the service.</li>
          <li>Analytics consent is stored locally in the browser until it is changed or browser storage is cleared.</li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p className="mt-3">
          GetInTheAnswer uses an essential, HttpOnly billing cookie after checkout so the subscribing browser can securely open Stripe&apos;s customer portal. It expires after 90 days. Google Analytics scripts and cookies are loaded only after the visitor accepts them.
        </p>
        <p className="mt-3"><CookiePreferencesButton /></p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p className="mt-3">
          Depending on the processing, you may request access, correction, deletion, restriction or portability of your data, object to processing based on legitimate interests, and withdraw consent at any time. Send a request to{" "}
          <a href="mailto:gregory@wemade.fr">gregory@wemade.fr</a> or to WEMADE at the postal address above. You may also lodge a complaint with the{" "}
          <a href="https://www.cnil.fr" rel="noreferrer" target="_blank">CNIL</a>.
        </p>
      </section>
    </LegalPage>
  );
}
