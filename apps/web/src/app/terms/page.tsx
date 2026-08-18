import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms governing professional use of GetInTheAnswer.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Professional service"
      title="Terms of service"
      intro="These terms govern access to GetInTheAnswer and its AI-visibility reports. The service is intended exclusively for professional users acting for business purposes."
    >
      <section>
        <h2>1. Provider and acceptance</h2>
        <p className="mt-3">
          The service is provided by WEMADE, SASU registered under number 832 419 428 R.C.S. Marseille. By requesting a scan or purchasing a subscription, the user confirms that they act for professional purposes and accept these terms.
        </p>
      </section>

      <section>
        <h2>2. The service</h2>
        <p className="mt-3">
          GetInTheAnswer tests business-related questions against available AI engines, audits public website information and produces visibility metrics and recommended actions. AI answers and availability can change. Reports are decision-support information, not a promise of ranking, traffic, revenue or a particular commercial result.
        </p>
      </section>

      <section>
        <h2>3. Free scans and acceptable use</h2>
        <p className="mt-3">
          Free scans are subject to reasonable technical and rate limits. The user must submit only public websites they are entitled to analyze. Attempts to reach private systems, bypass limits, interfere with the service, extract it automatically or use it unlawfully are prohibited.
        </p>
      </section>

      <section>
        <h2>4. Subscription, price and payment</h2>
        <p className="mt-3">
          The applicable currency, price, taxes and billing interval are displayed before payment in Stripe Checkout. The subscription renews automatically for the interval shown at checkout until cancelled. Payment is handled by Stripe. Access may be suspended when payment fails or a subscription is no longer active.
        </p>
      </section>

      <section>
        <h2>5. Cancellation</h2>
        <p className="mt-3">
          Subscribers can use “Manage billing” from their report to open Stripe&apos;s customer portal and cancel electronically. Cancellation takes effect under the conditions displayed in that portal, normally at the end of the current paid period. Amounts already paid are non-refundable except where mandatory law or an express written agreement requires otherwise.
        </p>
      </section>

      <section>
        <h2>6. Confidentiality and report links</h2>
        <p className="mt-3">
          Report URLs and billing access created after checkout must be kept confidential. The user is responsible for people with whom they share a report link. WEMADE may restrict access where misuse or a security risk is suspected.
        </p>
      </section>

      <section>
        <h2>7. Intellectual property</h2>
        <p className="mt-3">
          WEMADE retains all rights in the service, software, methodology, design and original materials. The user receives a limited, non-exclusive right to use purchased reports internally for their professional activity. The user retains rights in information they submit and authorizes WEMADE to process it as needed to provide the service.
        </p>
      </section>

      <section>
        <h2>8. Availability and liability</h2>
        <p className="mt-3">
          WEMADE aims to provide a reliable service but does not guarantee uninterrupted access or permanent availability of third-party AI engines. To the extent permitted for professional contracts, WEMADE is liable only for direct, foreseeable damage caused by a proven breach and excludes indirect loss, loss of profit, business interruption and decisions made solely from AI-generated information.
        </p>
      </section>

      <section>
        <h2>9. Data protection</h2>
        <p className="mt-3">
          Personal-data processing is described in the <a href="/privacy">privacy policy</a>, which forms part of the service information provided to users.
        </p>
      </section>

      <section>
        <h2>10. Governing law and disputes</h2>
        <p className="mt-3">
          These terms are governed by French law. The parties will first attempt to resolve any dispute amicably. For disputes between professional parties, and subject to mandatory rules, the courts within the jurisdiction of Marseille have exclusive jurisdiction.
        </p>
      </section>

      <section>
        <h2>11. Contact and changes</h2>
        <p className="mt-3">
          Questions can be sent to <a href="mailto:gregory@wemade.fr">gregory@wemade.fr</a>. WEMADE may update these terms for legal, security or service changes. The version published when an order is placed applies to that order, while material subscription changes will be communicated when required.
        </p>
      </section>
    </LegalPage>
  );
}
