"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

export function FaqSection2() {
  return (
    <section
      className="bg-background section-padding-y border-b"
      aria-labelledby="faq-heading"
      id="faq"
    >
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Left Column */}
          <div className="section-title-gap-lg flex flex-1 flex-col">
            {/* Category Tag */}
            <Tagline>FAQ</Tagline>
            {/* Main Title */}
            <h1 id="faq-heading" className="heading-lg text-foreground">
              Find answers to our frequently asked questions
            </h1>
            {/* Section Description */}
            <p className="text-muted-foreground">
              We&apos;ve compiled the most important information to help you get
              the most out of your experience. Can&apos;t find what you&apos;re
              looking for?{" "}
              <Link href="#" className="text-primary underline">
                Contact us.
              </Link>
            </p>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col gap-8">
            {/* General FAQ Section */}
            <div className="flex flex-col gap-2">
              {/* Section Title */}
              <h2 className="text-foreground text-lg font-semibold md:text-xl">
                General
              </h2>
              {/* FAQ Accordion */}
              <Accordion
                type="single"
                collapsible
                aria-label="General FAQ items"
              >
                {/* FAQ Item 1 */}
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How does AcquiSmart verify businesses?
                  </AccordionTrigger>
                  <AccordionContent>
                    AcquiSmart uses ML-powered fraud detection to verify every
                    business listing. We verify seller identities, validate
                    financial documents, check business licenses, and assign
                    credibility scores. Our AI analyzes 200+ data points to
                    ensure only legitimate, serious sellers appear on our
                    platform.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 2 */}
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    What types of businesses can I find on AcquiSmart?
                  </AccordionTrigger>
                  <AccordionContent>
                    AcquiSmart features businesses across all industries and
                    sizes, from small local shops to mid-market companies. You'll
                    find technology companies, retail stores, healthcare
                    practices, manufacturing businesses, service companies, and
                    more. Our AI matching helps you discover opportunities that
                    align with your investment criteria and experience.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 3 */}
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    How does the NDA process work?
                  </AccordionTrigger>
                  <AccordionContent>
                    Before accessing sensitive business information like
                    financials or customer data, you'll sign a built-in NDA
                    through our platform. The process is quick and legally
                    binding, protecting both buyers and sellers. NDAs are stored
                    securely and tracked automatically, so all parties have a
                    record of confidentiality agreements.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 4 */}
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    How accurate is the AI matching?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our AI matching achieves 95%+ accuracy by analyzing 200+
                    compatibility factors including your budget, industry
                    experience, location preferences, and business goals. The
                    algorithm learns from successful matches and continuously
                    improves. You'll see a match score with each business listing
                    to help you prioritize opportunities.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Billing FAQ Section */}
            <div className="flex flex-col gap-2">
              {/* Section Title */}
              <h2 className="text-foreground text-lg font-semibold md:text-xl">
                Billing
              </h2>
              {/* FAQ Accordion */}
              <Accordion
                type="single"
                collapsible
                aria-label="Billing FAQ items"
              >
                {/* FAQ Item 1 */}
                <AccordionItem value="billing-1">
                  <AccordionTrigger className="text-left">
                    How does the free plan work?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our free plan includes up to 5 hours of meeting
                    transcription per month, basic AI summaries, and access to
                    core features. You can upgrade to paid plans anytime for
                    unlimited transcription, advanced analytics, and premium
                    features. No credit card required to start with the free
                    plan.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 2 */}
                <AccordionItem value="billing-2">
                  <AccordionTrigger className="text-left">
                    Can I change my plan anytime?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can upgrade, downgrade, or cancel your plan at any
                    time. Changes take effect immediately, and we&apos;ll
                    prorate any charges. If you downgrade, you&apos;ll keep
                    access to premium features until the end of your current
                    billing period. No long-term contracts or cancellation fees.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 3 */}
                <AccordionItem value="billing-3">
                  <AccordionTrigger className="text-left">
                    Do you offer annual billing discounts?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer a 20% discount when you choose annual billing.
                    This applies to all paid plans and can save you
                    significantly over monthly billing. Annual plans are billed
                    upfront and automatically renew unless cancelled. You can
                    still change plans during your annual term.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 4 */}
                <AccordionItem value="billing-4">
                  <AccordionTrigger className="text-left">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent>
                    We accept all major credit cards (Visa, Mastercard, American
                    Express, Discover), PayPal, and bank transfers for annual
                    plans. All payments are processed securely through Stripe.
                    We also support corporate invoicing for enterprise customers
                    with net 30 payment terms.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
