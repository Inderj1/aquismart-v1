"use client";

import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Shield, Users, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const solutions = [
    {
      icon: Building2,
      title: "For LP Investors",
      subtitle: "Limited Partners & Institutional Investors",
      description: "Automate GP reporting analysis and portfolio monitoring across your entire fund-of-funds program",
      features: [
        "Automated capital account processing",
        "Cross-fund portfolio aggregation",
        "Benchmark comparisons and peer analytics",
        "Look-through exposure tracking"
      ],
      cta: "Learn More"
    },
    {
      icon: TrendingUp,
      title: "For GP Fund Managers",
      subtitle: "Private Equity & Venture Capital Firms",
      description: "Streamline portfolio company monitoring, valuations, and IC reporting with AI-powered insights",
      features: [
        "Quarterly package extraction",
        "Automated DCF and comps valuations",
        "AI-generated investment memos",
        "Portfolio dashboards and KPIs"
      ],
      cta: "Learn More"
    },
    {
      icon: Shield,
      title: "For Credit Investors",
      subtitle: "Debt Funds & Direct Lenders",
      description: "Monitor covenant compliance, predict breaches, and automate credit risk analysis",
      features: [
        "Covenant tracking and alerting",
        "Breach prediction (LSTM models)",
        "Waterfall analysis automation",
        "PD/LGD/EAD credit scoring"
      ],
      cta: "Learn More"
    },
    {
      icon: Users,
      title: "For Fund Administrators",
      subtitle: "Third-Party Administrators",
      description: "Accelerate client reporting with AI-powered document processing and validation",
      features: [
        "Multi-client document ingestion",
        "Automated reconciliation workflows",
        "White-label reporting portals",
        "Audit-ready lineage tracking"
      ],
      cta: "Learn More"
    }
  ];

  const useCases = [
    {
      title: "Quarterly GP Reporting",
      metric: "95%",
      description: "Reduction in manual data entry time"
    },
    {
      title: "Valuation Process",
      metric: "10x",
      description: "Faster memo generation with AI"
    },
    {
      title: "Covenant Monitoring",
      metric: "75%",
      description: "Breach prediction accuracy"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />

      <section className="border-b bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Solutions for Every Private Markets Stakeholder
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI-powered automation tailored to your workflow
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <solution.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-2xl">{solution.title}</CardTitle>
                  <CardDescription className="text-base">{solution.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{solution.description}</p>
                  <ul className="space-y-3 mb-6">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Zap className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    {solution.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Proven Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <p className="text-5xl font-bold text-primary mb-3">{useCase.metric}</p>
                  <h3 className="font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule a demo to see how AcquiSmart can transform your private markets operations
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/early-access">
              <Button size="lg">Request Demo</Button>
            </Link>
            <Link href="/platform">
              <Button size="lg" variant="outline">View Platform</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer1 />
    </div>
  );
}
