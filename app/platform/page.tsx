"use client";

import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Brain, TrendingUp, Shield, Zap, Database, Search, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function PlatformPage() {
  const coreFeatures = [
    {
      icon: FileText,
      title: "Intelligent Document Processing",
      description: "AI-powered OCR and extraction from GP documents",
      features: [
        "LayoutLM document classification (92%+ accuracy)",
        "Multi-page table extraction",
        "Field extraction with confidence scoring",
        "Source lineage tracking"
      ]
    },
    {
      icon: Brain,
      title: "AI Entity Resolution",
      description: "Fuzzy matching across funds and companies",
      features: [
        "Named Entity Recognition",
        "XGBoost classification",
        "Reconciliation workflows",
        "KPI synonym mapping"
      ]
    },
    {
      icon: TrendingUp,
      title: "Automated Valuation",
      description: "DCF models and AI-generated memos",
      features: [
        "DCF and comps engines",
        "Driver attribution (SHAP)",
        "GPT-4 memo generation",
        "Scenario analysis"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />
      <section className="border-b bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              AI-First Private Equity Platform
            </h1>
            <p className="text-lg text-muted-foreground">
              Intelligent document processing, automated valuations, and portfolio monitoring
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Platform Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <Zap className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer1 />
    </div>
  );
}
