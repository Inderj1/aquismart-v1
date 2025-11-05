"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calculator,
  Search,
  FileCheck,
  TrendingUp,
  Handshake,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  Download,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function BuyerResourcesPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [sectionTabs, setSectionTabs] = useState<Record<string, string>>({});

  const toggleSection = (sectionId: string) => {
    setCompletedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getSectionTab = (sectionId: string) => {
    return sectionTabs[sectionId] || "key-points";
  };

  const setSectionTab = (sectionId: string, tab: string) => {
    setSectionTabs(prev => ({ ...prev, [sectionId]: tab }));
  };

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      description: "Assess your readiness and define your acquisition goals",
      content: {
        overview: "Before diving into business acquisition, it's crucial to assess your readiness and define clear goals. This foundational step will guide your entire journey.",
        keyPoints: [
          "Evaluate your experience and skills relevant to business ownership",
          "Assess your financial position and risk tolerance",
          "Define your industry preferences and business size targets",
          "Determine your level of involvement (full-time, part-time, passive)",
          "Set clear timeline expectations for your search and acquisition"
        ],
        checklist: [
          "Complete self-assessment questionnaire",
          "Review personal financial statements",
          "Identify 3-5 target industries",
          "Define deal size range",
          "Set search timeline (3-12 months typical)"
        ],
        tips: [
          "Be honest about your strengths and weaknesses",
          "Consider getting a business coach or advisor",
          "Start networking in your target industries",
          "Join business acquisition communities"
        ]
      }
    },
    {
      id: "financial-prep",
      title: "Financial Preparation",
      icon: Calculator,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      description: "Understand financing options and prepare your financial foundation",
      content: {
        overview: "Securing financing is often the most challenging aspect of buying a business. Understanding your options early helps you move quickly when you find the right opportunity.",
        keyPoints: [
          "SBA Loans: Government-backed loans offering favorable terms (10-25 year amortization, 10% down payment)",
          "Conventional Bank Loans: Traditional financing requiring strong credit and collateral",
          "Seller Financing: Seller provides part of funding, typically 20-30% of purchase price",
          "Investor Capital: Bring in partners or private equity for larger deals",
          "Personal Funds: Using savings, home equity, or retirement accounts (with caution)"
        ],
        checklist: [
          "Check your credit score (aim for 680+)",
          "Gather 3 years of personal tax returns",
          "Prepare personal financial statement",
          "Calculate available liquid capital",
          "Get pre-qualified with SBA lenders",
          "Build relationships with business brokers"
        ],
        tips: [
          "Start working with an SBA-experienced lender early",
          "Maintain good credit during your search",
          "Keep 6-12 months operating capital reserve",
          "Consider multiple financing sources for flexibility"
        ]
      }
    },
    {
      id: "search-strategy",
      title: "Search Strategy",
      icon: Search,
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80",
      description: "Develop a systematic approach to finding the right business",
      content: {
        overview: "A well-defined search strategy saves time and increases your chances of finding the perfect business match. Focus on quality over quantity.",
        keyPoints: [
          "Define specific search criteria (industry, location, size, profitability)",
          "Use multiple sourcing channels (marketplaces, brokers, direct outreach)",
          "Leverage your network for off-market deals",
          "Create a systematic evaluation process",
          "Move quickly on good opportunities"
        ],
        checklist: [
          "Create target business profile",
          "Set up alerts on marketplaces like AcquiSmart",
          "Connect with 5-10 business brokers",
          "Join industry associations",
          "Attend local business events",
          "Prepare standardized evaluation criteria"
        ],
        tips: [
          "The best deals often come through relationships",
          "Be prepared to make decisions quickly",
          "Don't get emotionally attached too early",
          "Track all opportunities in a spreadsheet"
        ]
      }
    },
    {
      id: "due-diligence",
      title: "Due Diligence",
      icon: FileCheck,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      description: "Thoroughly investigate before committing to purchase",
      content: {
        overview: "Due diligence is your opportunity to verify everything the seller has told you and uncover any potential issues. This is the most critical phase of the acquisition process.",
        keyPoints: [
          "Financial Due Diligence: Verify revenue, expenses, and profitability",
          "Operational Review: Understand processes, systems, and dependencies",
          "Legal Compliance: Check licenses, permits, contracts, and liabilities",
          "Customer Analysis: Assess customer concentration and retention",
          "Employee Review: Evaluate key personnel and labor issues"
        ],
        checklist: [
          "Review 3+ years of tax returns and financials",
          "Verify revenue sources and customer contracts",
          "Inspect all assets and inventory",
          "Review all material contracts and leases",
          "Check for pending litigation or liabilities",
          "Interview key employees (if possible)",
          "Validate intellectual property and trademarks",
          "Conduct market research on competition"
        ],
        tips: [
          "Hire a CPA to review financials",
          "Use attorneys for legal review",
          "Don't rush this phase - typical DD takes 30-60 days",
          "Create a detailed checklist and track progress"
        ]
      }
    },
    {
      id: "valuation",
      title: "Business Valuation",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      description: "Learn how to properly value a business opportunity",
      content: {
        overview: "Understanding valuation methods helps you determine fair market value and negotiate effectively. Different industries use different multiples.",
        keyPoints: [
          "SDE Multiple: Seller's Discretionary Earnings × Industry Multiple (2-4x typical for small businesses)",
          "EBITDA Multiple: Earnings Before Interest, Taxes, Depreciation, Amortization × Multiple (4-8x typical)",
          "Revenue Multiple: Used for high-growth or asset-light businesses",
          "Asset-Based: Book value of assets (for asset-heavy businesses)",
          "Discounted Cash Flow: Future cash flows discounted to present value"
        ],
        checklist: [
          "Calculate normalized SDE or EBITDA",
          "Research industry-specific multiples",
          "Adjust for one-time expenses or owner benefits",
          "Factor in growth trends and market conditions",
          "Consider working capital requirements",
          "Account for necessary capital expenditures"
        ],
        tips: [
          "Most small businesses sell for 2-4x SDE",
          "Higher multiples require growth and recurring revenue",
          "Adjust for owner dependencies and key person risk",
          "Get a professional valuation for larger deals"
        ]
      }
    },
    {
      id: "deal-structure",
      title: "Deal Structure & Negotiation",
      icon: Handshake,
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80",
      description: "Structure the deal and negotiate favorable terms",
      content: {
        overview: "How you structure the deal can be as important as the price. Creative deal structures can help bridge valuation gaps and reduce risk.",
        keyPoints: [
          "Asset Sale vs. Stock Sale: Tax implications and liability considerations",
          "Seller Financing: Reduces upfront capital and aligns seller interests",
          "Earn-outs: Tie part of purchase price to future performance",
          "Employment Agreements: Secure seller's transition assistance",
          "Non-compete Clauses: Protect business value post-acquisition"
        ],
        checklist: [
          "Determine asset vs. stock purchase preference",
          "Calculate total cash needed at closing",
          "Negotiate seller financing terms (rate, term, security)",
          "Define transition period and seller involvement",
          "Set clear terms for earn-outs if applicable",
          "Include contingencies (financing, due diligence)",
          "Negotiate non-compete duration and scope"
        ],
        tips: [
          "Asset purchases are typically preferred by buyers",
          "Seller financing shows seller confidence in the business",
          "Aim for 60-90 day transition period with seller",
          "Don't negotiate on price alone - terms matter"
        ]
      }
    },
    {
      id: "closing",
      title: "Closing Process",
      icon: FileText,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      description: "Navigate the final steps to complete your acquisition",
      content: {
        overview: "The closing process involves coordinating multiple parties and ensuring all legal and financial requirements are met. Proper preparation ensures a smooth closing.",
        keyPoints: [
          "Purchase Agreement: Final contract detailing all terms",
          "Loan Closing: Finalize financing with lender",
          "Asset Transfer: Legal transfer of business assets",
          "Seller Transition: Begin working with seller on handoff",
          "Entity Formation: Set up new business entity if needed"
        ],
        checklist: [
          "Review and sign purchase agreement",
          "Complete lender requirements and documentation",
          "Arrange for business insurance coverage",
          "Transfer licenses and permits",
          "Update vendor and customer contracts",
          "Set up new bank accounts and payment processing",
          "Transfer domain names and intellectual property",
          "Notify employees of ownership change"
        ],
        tips: [
          "Use experienced M&A attorney for closing documents",
          "Build in transition period for training",
          "Create detailed transition checklist",
          "Plan for Day 1 operations before closing"
        ]
      }
    },
    {
      id: "post-acquisition",
      title: "Post-Acquisition Integration",
      icon: Users,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      description: "Successfully transition and grow your new business",
      content: {
        overview: "The first 90 days after acquisition are critical. Focus on stabilizing operations, building relationships, and identifying quick wins.",
        keyPoints: [
          "Week 1-2: Meet all key stakeholders (employees, customers, vendors)",
          "Month 1: Learn operations and stabilize current business",
          "Month 2-3: Implement small improvements and build trust",
          "Month 3+: Execute on strategic growth initiatives",
          "Ongoing: Regular communication with all stakeholders"
        ],
        checklist: [
          "Schedule one-on-one meetings with all employees",
          "Reach out to top 20 customers",
          "Meet with key vendors and suppliers",
          "Review and optimize all contracts",
          "Assess technology and systems",
          "Identify quick operational improvements",
          "Set 90-day goals and metrics",
          "Establish regular reporting and review processes"
        ],
        tips: [
          "Listen more than you talk in the first 30 days",
          "Honor commitments made during acquisition",
          "Make small improvements before big changes",
          "Build trust with employees before major changes",
          "Keep seller involved during transition period"
        ]
      }
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <Link href="/dashboard/buyer">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Buyer's Guide</h1>
        </div>
        <p className="text-muted-foreground">
          Your comprehensive resource for successfully acquiring a business
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Completed Sections</span>
                <span className="font-semibold">{completedSections.length} of {sections.length}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
                />
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {Math.round((completedSections.length / sections.length) * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          const isCompleted = completedSections.includes(section.id);
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block"
            >
              <Card className={`hover:border-primary transition-colors cursor-pointer ${isCompleted ? 'border-green-500' : ''}`}>
                <CardContent className="p-4 text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${isCompleted ? 'text-green-500' : 'text-primary'}`} />
                  <p className="text-sm font-medium">{section.title}</p>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mt-2" />
                  )}
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          const isCompleted = completedSections.includes(section.id);

          return (
            <Card key={section.id} id={section.id} className="scroll-mt-20">
              {/* Hero Image */}
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-8 w-8" />
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <p className="text-white/90">{section.description}</p>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground">{section.content.overview}</p>
                </div>

                {/* Tabs for different content types */}
                <Tabs value={getSectionTab(section.id)} onValueChange={(tab) => setSectionTab(section.id, tab)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="key-points">Key Points</TabsTrigger>
                    <TabsTrigger value="checklist">Checklist</TabsTrigger>
                    <TabsTrigger value="tips">Pro Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="key-points" className="space-y-3 mt-4">
                    {section.content.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{point}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="checklist" className="space-y-2 mt-4">
                    {section.content.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="tips" className="space-y-3 mt-4">
                    {section.content.tips.map((tip, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
                        <p className="text-sm font-medium">{tip}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                {/* Mark as Complete Button */}
                <div className="mt-6 pt-6 border-t">
                  <Button
                    onClick={() => toggleSection(section.id)}
                    variant={isCompleted ? "outline" : "default"}
                    className="w-full"
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        Mark as Complete
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Resources */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/marketplace">
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Browse Available Businesses
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download Acquisition Checklist
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center pt-4">
            Need personalized guidance? Consider working with an acquisition advisor or business broker.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
