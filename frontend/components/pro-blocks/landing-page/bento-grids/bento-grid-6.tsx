"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

export function BentoGrid6() {
  return (
    <section className="bg-background section-padding-y border-b" id="features">
      <div className="container-padding-x container mx-auto flex flex-col gap-10 md:gap-12">
        {/* Section Title */}
        <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
          {/* Tagline */}
          <Tagline>Features</Tagline>
          {/* Main Heading */}
          <h2 className="heading-lg">
            Advanced Platform Features
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* Wide Feature Card - Top Left */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
            <Image
              src="/ai-meeting-notes.png"
              alt="Trust & Verification"
              width={813}
              height={332}
              className="hidden h-auto w-full object-cover md:block md:h-[332px]"
            />
            <Image
              src="/ai-meeting-notes_mobile.png"
              alt="Trust & Verification"
              width={480}
              height={332}
              className="block h-auto w-full md:hidden"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                Trust & Verification
              </h3>
              <p className="text-muted-foreground">
                Every listing is verified with ML-powered fraud detection and credibility scores
              </p>
            </CardContent>
          </Card>
          {/* Regular Feature Card - Top Right */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
            <Image
              src="/universal-search.png"
              alt="AI-Driven Matching"
              width={480}
              height={332}
              className="h-auto w-full object-cover md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                AI-Driven Matching
              </h3>
              <p className="text-muted-foreground">
                Our algorithm analyzes 200+ compatibility factors to connect buyers with businesses
              </p>
            </CardContent>
          </Card>
          {/* Regular Feature Card - Bottom Left */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
            <Image
              src="/smart-tags.png"
              alt="Smart Alerts"
              width={480}
              height={332}
              className="h-auto w-full object-cover md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                Smart Alerts
              </h3>
              <p className="text-muted-foreground">
                Save search criteria and get instant alerts for new matches
              </p>
            </CardContent>
          </Card>
          {/* Wide Feature Card - Bottom Right */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
            <Image
              src="/team-insights.png"
              alt="Automated Valuations"
              width={813}
              height={332}
              className="hidden h-[332px] w-full object-cover md:block"
            />
            <Image
              src="/team-insights_mobile.png"
              alt="Automated Valuations"
              width={480}
              height={332}
              className="block h-auto w-full object-cover md:hidden md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                Automated Valuations
              </h3>
              <p className="text-muted-foreground">
                Industry-benchmarked valuations that go beyond simple multiples
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
