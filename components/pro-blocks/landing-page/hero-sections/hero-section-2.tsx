"use client";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import Image from "next/image";

export function HeroSection2() {
  return (
    <section
      className="bg-secondary section-padding-y"
      aria-labelledby="hero-heading"
    >
      <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          {/* Section Title */}
          <div className="section-title-gap-xl flex flex-col">
            {/* Tagline */}
            <Tagline>New Platform Launch - Early Access Available</Tagline>
            {/* Main Heading */}
            <h1 id="hero-heading" className="heading-xl">
              Find Your Perfect Business Match
            </h1>
            {/* Description */}
            <p className="text-muted-foreground text-base lg:text-lg">
              We're building the first AI-powered marketplace that connects serious buyers with verified sellers. Be among our founding members and shape the future of business acquisition.
            </p>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                AI-powered matching with 95% accuracy
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                ML-powered fraud detection
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Check className="text-primary h-5 w-5" />
              </div>
              <span className="text-card-foreground text-base leading-6 font-medium">
                Secure NDA workflows
              </span>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="w-full flex-1">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <video
              src="/video1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
