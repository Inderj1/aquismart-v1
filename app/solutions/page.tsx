import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Check, User, Users, Building2, TrendingUp, ShoppingCart, Wrench, Factory, Laptop } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SolutionsPage() {
  return (
    <main>
      <LpNavbar1 />

      {/* Hero Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 lg:gap-8">
            <div className="section-title-gap-xl flex flex-col">
              <Tagline>Solutions</Tagline>
              <h1 className="heading-xl">
                Tailored Solutions for Every Buyer
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                Whether you're a first-time buyer or a seasoned acquirer, AcquiSmart provides the tools and insights you need to find and acquire the perfect business.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/marketplace">
                <Button>Find Your Match</Button>
              </Link>
              <Link href="#buyer-types">
                <Button variant="ghost">Explore Solutions</Button>
              </Link>
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80"
                alt="Team collaboration"
                fill
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Types Section */}
      <section className="bg-background section-padding-y border-b" id="buyer-types">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Buyer Types</Tagline>
            <h2 className="heading-lg">
              Solutions Designed for Your Acquisition Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First-Time Buyers */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <User className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  First-Time Buyers
                </h3>
                <p className="text-muted-foreground">
                  New to business acquisition? We guide you through every step with educational resources, simplified workflows, and expert support.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Step-by-step acquisition guides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Simplified due diligence checklists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Access to acquisition advisors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Pre-vetted business opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Serial Acquirers */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  Serial Acquirers
                </h3>
                <p className="text-muted-foreground">
                  Scale your portfolio efficiently with advanced search filters, bulk deal management, and priority access to premium listings.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Portfolio management dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Advanced filtering and automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Priority listing access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Dedicated account manager</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Private Equity */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Building2 className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  Private Equity & Investment Firms
                </h3>
                <p className="text-muted-foreground">
                  Source deal flow at scale with institutional-grade tools, comprehensive analytics, and white-glove service for your team.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Team collaboration workspace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Advanced market analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Custom deal sourcing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">API access for integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Strategic Buyers */}
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground text-xl font-semibold">
                  Strategic Buyers
                </h3>
                <p className="text-muted-foreground">
                  Find synergistic acquisitions that complement your existing business with AI-powered strategic fit analysis and integration planning.
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Synergy scoring and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Competitive landscape insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Integration planning tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Confidential search capabilities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="bg-secondary section-padding-y border-b" id="industries">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Industries</Tagline>
            <h2 className="heading-lg">
              Specialized Expertise Across Industries
            </h2>
            <p className="text-muted-foreground">
              Our platform understands the unique dynamics of different business sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* SaaS & Technology */}
            <Card className="bg-background/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Laptop className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">
                  SaaS & Technology
                </h3>
                <p className="text-muted-foreground text-sm">
                  MRR/ARR analysis, churn metrics, tech stack evaluation, and customer retention insights
                </p>
              </CardContent>
            </Card>

            {/* E-commerce */}
            <Card className="bg-background/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">
                  E-commerce
                </h3>
                <p className="text-muted-foreground text-sm">
                  Inventory analysis, supplier relationships, marketplace presence, and conversion metrics
                </p>
              </CardContent>
            </Card>

            {/* Service Businesses */}
            <Card className="bg-background/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Wrench className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">
                  Service Businesses
                </h3>
                <p className="text-muted-foreground text-sm">
                  Customer contracts, employee retention, service delivery systems, and reputation analysis
                </p>
              </CardContent>
            </Card>

            {/* Manufacturing */}
            <Card className="bg-background/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Factory className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">
                  Manufacturing
                </h3>
                <p className="text-muted-foreground text-sm">
                  Equipment valuation, supply chain assessment, facility inspection, and production capacity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Results</Tagline>
            <h2 className="heading-lg">
              Real Results from Real Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="text-5xl font-bold text-primary">95%</div>
              <div className="text-foreground font-semibold">Matching Accuracy</div>
              <p className="text-sm text-muted-foreground">
                Buyers find businesses that meet their criteria on first search
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="text-5xl font-bold text-primary">2 weeks</div>
              <div className="text-foreground font-semibold">Average Time to Match</div>
              <p className="text-sm text-muted-foreground">
                From sign-up to finding a serious acquisition target
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="text-5xl font-bold text-primary">100%</div>
              <div className="text-foreground font-semibold">Verified Listings</div>
              <p className="text-sm text-muted-foreground">
                Every business undergoes ML-powered fraud detection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <h2 className="heading-lg max-w-2xl">
              Find the Perfect Solution for Your Acquisition Goals
            </h2>
            <p className="text-muted-foreground max-w-xl">
              No matter your experience level or industry focus, AcquiSmart has the tools and expertise to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/marketplace">
                <Button size="lg">Start Your Search</Button>
              </Link>
              <Link href="/platform">
                <Button size="lg" variant="outline">Explore Platform</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </main>
  );
}
