import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Check, Shield, Brain, FileCheck, TrendingUp, Search, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PlatformPage() {
  return (
    <main>
      <LpNavbar1 />

      {/* Hero Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 lg:gap-8">
            <div className="section-title-gap-xl flex flex-col">
              <Tagline>Platform Overview</Tagline>
              <h1 className="heading-xl">
                Your Complete Business Acquisition Platform
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                AcquiSmart combines cutting-edge AI technology with comprehensive verification systems to make business acquisition simple, secure, and successful.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/marketplace">
                <Button>Explore Marketplace</Button>
              </Link>
              <Link href="#features">
                <Button variant="ghost">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Business analytics dashboard"
                fill
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="bg-background section-padding-y border-b" id="features">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Core Features</Tagline>
            <h2 className="heading-lg">
              Everything You Need to Find and Acquire the Right Business
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* AI Matching */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Brain className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  AI-Powered Matching
                </h3>
                <p className="text-muted-foreground">
                  Our advanced algorithm analyzes 200+ compatibility factors including your budget, industry experience, location preferences, and business goals to deliver 95%+ matching accuracy.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Smart preference learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Real-time match scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Personalized recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Fraud Detection */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  ML-Powered Verification
                </h3>
                <p className="text-muted-foreground">
                  Every listing undergoes rigorous verification using machine learning models trained on thousands of legitimate business transactions and fraud patterns.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Identity verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Financial document validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Credibility scoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Automated Valuations */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  Industry Benchmarked Valuations
                </h3>
                <p className="text-muted-foreground">
                  Get accurate business valuations that go beyond simple multiples, incorporating industry trends, growth metrics, and market conditions.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Multi-factor analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Market comparables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Risk assessment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Smart Search */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Search className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  Smart Search & Alerts
                </h3>
                <p className="text-muted-foreground">
                  Save your search criteria and receive instant notifications when new businesses matching your parameters are listed on the platform.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Custom search filters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Real-time alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Saved searches</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Secure Documentation */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Lock className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  Secure NDA Workflows
                </h3>
                <p className="text-muted-foreground">
                  Built-in confidentiality agreements and secure document sharing protect both buyers and sellers throughout the acquisition process.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">One-click NDAs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Encrypted file sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Audit trails</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Due Diligence */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <FileCheck className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  Streamlined Due Diligence
                </h3>
                <p className="text-muted-foreground">
                  Access organized financial documents, verified business licenses, and comprehensive business information all in one secure location.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Document checklists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Verification status tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Seller Q&A system</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Process</Tagline>
            <h2 className="heading-lg">
              Four Simple Steps to Your Next Acquisition
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-3">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-foreground font-semibold text-lg">Create Your Profile</h3>
              <p className="text-muted-foreground text-sm">
                Tell us about your acquisition criteria, budget, and experience. Our AI learns your preferences.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-foreground font-semibold text-lg">Discover Matches</h3>
              <p className="text-muted-foreground text-sm">
                Browse verified businesses or let our algorithm surface the best opportunities for you.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-foreground font-semibold text-lg">Conduct Due Diligence</h3>
              <p className="text-muted-foreground text-sm">
                Access verified documents, sign NDAs, and communicate directly with sellers in a secure environment.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="text-foreground font-semibold text-lg">Close the Deal</h3>
              <p className="text-muted-foreground text-sm">
                Leverage our escrow services and legal support to complete your acquisition with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <h2 className="heading-lg max-w-2xl">
              Ready to Find Your Perfect Business Match?
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Join AcquiSmart today and get access to verified business listings, AI-powered matching, and a streamlined acquisition process.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/marketplace">
                <Button size="lg">Start Exploring</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </main>
  );
}
