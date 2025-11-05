"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";

interface QuestionnaireData {
  userType: "buyer" | "seller" | "pe" | "";
  [key: string]: any;
}

export default function ExpertModePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuestionnaireData>({
    userType: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile data from previous onboarding
    if (typeof window !== 'undefined') {
      const profileData = localStorage.getItem('buyerProfile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        // Map 'buy' to 'buyer' and 'sell' to 'seller'
        const userType = profile.userType === 'buy' ? 'buyer' : profile.userType === 'sell' ? 'seller' : profile.userType;
        setData({
          userType,
          industry: profile.industry,
          location: profile.location,
        });
        setLoading(false);
      } else {
        // No profile found, redirect to get matched first
        router.push('/marketplace');
      }
    }
  }, [router]);

  const buyerQuestions = [
    {
      id: "budget",
      question: "What is your budget range?",
      type: "radio",
      options: ["Under $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M", "Over $10M"]
    },
    {
      id: "businessSize",
      question: "What size business are you looking for?",
      type: "radio",
      options: ["Micro (1-10 employees)", "Small (11-50 employees)", "Medium (51-200 employees)", "Large (200+ employees)", "No preference"]
    },
    {
      id: "revenuePreference",
      question: "Preferred annual revenue range?",
      type: "radio",
      options: ["Under $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M", "$10M+", "No preference"]
    },
    {
      id: "profitability",
      question: "Profitability requirement?",
      type: "radio",
      options: ["Must be profitable now", "Break-even acceptable", "Growth over profit", "Turnaround opportunity", "No preference"]
    },
    {
      id: "involvement",
      question: "How involved do you want to be?",
      type: "radio",
      options: ["Full-time owner/operator", "Part-time involvement", "Passive investor", "Hands-off with management team", "Undecided"]
    },
    {
      id: "timeline",
      question: "What is your purchase timeline?",
      type: "radio",
      options: ["Immediately (0-1 month)", "Within 3 months", "Within 6 months", "Within 1 year", "Just exploring"]
    },
    {
      id: "experience",
      question: "Do you have experience running a business?",
      type: "radio",
      options: ["Yes, I own/owned a business", "Yes, as an executive", "Some experience", "First-time buyer"]
    },
    {
      id: "financing",
      question: "How will you finance the purchase?",
      type: "radio",
      options: ["All cash", "SBA loan", "Seller financing", "Combination", "Still exploring options"]
    }
  ];

  const sellerQuestions = [
    {
      id: "yearsInBusiness",
      question: "How long has the business been operating?",
      type: "radio",
      options: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10-20 years", "20+ years"]
    },
    {
      id: "businessSize",
      question: "How many employees does the business have?",
      type: "radio",
      options: ["Solo (just me)", "2-10 employees", "11-50 employees", "51-200 employees", "200+ employees"]
    },
    {
      id: "revenue",
      question: "What is your annual revenue?",
      type: "radio",
      options: ["Under $250K", "$250K - $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M", "Over $10M"]
    },
    {
      id: "profitMargin",
      question: "What is your profit margin?",
      type: "radio",
      options: ["Not profitable yet", "0-10%", "10-20%", "20-30%", "30%+", "Prefer not to say"]
    },
    {
      id: "askingPrice",
      question: "What is your asking price range?",
      type: "radio",
      options: ["Under $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M", "Over $10M", "Not sure yet"]
    },
    {
      id: "growthTrend",
      question: "What is your revenue trend?",
      type: "radio",
      options: ["Rapidly growing (20%+ YoY)", "Steady growth (5-20% YoY)", "Stable/flat", "Declining", "Seasonal/varies"]
    },
    {
      id: "timeline",
      question: "When do you want to sell?",
      type: "radio",
      options: ["Immediately (0-1 month)", "Within 3 months", "Within 6 months", "Within 1 year", "Just exploring valuation"]
    },
    {
      id: "reason",
      question: "Why are you selling?",
      type: "radio",
      options: ["Retirement", "Starting new venture", "Health reasons", "Relocation", "Financial reasons", "Partnership dissolution", "Ready to exit"]
    },
    {
      id: "involvement",
      question: "Are you willing to stay involved post-sale?",
      type: "radio",
      options: ["Yes, full transition support", "Yes, consulting role (3-6 months)", "Brief transition only", "Clean exit preferred", "Negotiable"]
    }
  ];

  const peQuestions = [
    {
      id: "fundSize",
      question: "What is your fund size?",
      type: "radio",
      options: ["Under $10M", "$10M - $50M", "$50M - $100M", "$100M - $500M", "Over $500M"]
    },
    {
      id: "targetIndustries",
      question: "Target industries for investment?",
      type: "radio",
      options: ["Technology", "Healthcare", "Consumer Goods", "Financial Services", "Manufacturing", "Real Estate", "Professional Services", "Multiple sectors", "Sector agnostic"]
    },
    {
      id: "dealSize",
      question: "Typical deal size?",
      type: "radio",
      options: ["Under $1M", "$1M - $5M", "$5M - $20M", "$20M - $100M", "Over $100M"]
    },
    {
      id: "investmentStage",
      question: "Preferred investment stage?",
      type: "radio",
      options: ["Early stage", "Growth stage", "Mature/profitable", "Distressed/turnaround", "All stages"]
    },
    {
      id: "revenueRequirement",
      question: "Minimum annual revenue requirement?",
      type: "radio",
      options: ["Pre-revenue acceptable", "$500K+", "$1M+", "$5M+", "$10M+", "$50M+"]
    },
    {
      id: "profitabilityRequirement",
      question: "Profitability requirement?",
      type: "radio",
      options: ["Must be profitable", "EBITDA positive", "Path to profitability", "Growth over profit", "No requirement"]
    },
    {
      id: "holdPeriod",
      question: "Expected hold period?",
      type: "radio",
      options: ["Short-term (1-3 years)", "Medium-term (3-5 years)", "Long-term (5-10 years)", "10+ years", "Flexible"]
    },
    {
      id: "investmentStrategy",
      question: "Primary investment strategy?",
      type: "radio",
      options: ["Control/majority stake", "Minority growth equity", "Platform acquisition", "Add-on acquisition", "Recapitalization", "Mixed strategy"]
    },
    {
      id: "geography",
      question: "Geographic focus?",
      type: "radio",
      options: ["North America", "United States only", "Northeast US", "West Coast US", "Global", "Europe", "Asia Pacific", "Latin America", "Multi-regional"]
    },
    {
      id: "dealFlow",
      question: "Current deal flow activity?",
      type: "radio",
      options: ["Actively deploying capital", "Actively sourcing deals", "Selectively looking", "Recently raised fund", "Exploring opportunities"]
    }
  ];

  const getQuestions = () => {
    if (data.userType === "buyer") return buyerQuestions;
    if (data.userType === "seller") return sellerQuestions;
    if (data.userType === "pe") return peQuestions;
    return [];
  };

  const questions = getQuestions();
  const currentQuestion = questions[step - 1];

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/marketplace/matches');
    }
  };

  const handleComplete = () => {
    // Save data to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('expertModeProfile', JSON.stringify(data));
      // Trigger custom event to update navbar
      window.dispatchEvent(new Event('loginStatusChange'));
    }

    // Redirect based on user type
    if (data.userType === "buyer") {
      router.push('/dashboard/buyer');
    } else if (data.userType === "seller") {
      router.push('/dashboard/seller');
    } else if (data.userType === "pe") {
      router.push('/dashboard');
    }
  };

  const handleInputChange = (value: string) => {
    if (currentQuestion) {
      setData({ ...data, [currentQuestion.id]: value });
    }
  };

  // Loading state while fetching profile
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LpNavbar1 />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Question Steps
  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl mb-2">Expert Mode</CardTitle>
              <p className="text-center text-muted-foreground text-sm mb-4">
                Tell us more to get highly personalized recommendations
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {step} of {questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((step / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(step / questions.length) * 100}%` }}
                />
              </div>
              <CardTitle className="text-xl">{currentQuestion?.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuestion?.type === "radio" && (
                <RadioGroup
                  value={data[currentQuestion.id] || ""}
                  onValueChange={handleInputChange}
                >
                  {currentQuestion.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary cursor-pointer">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion?.type === "input" && (
                <Input
                  placeholder={(currentQuestion as any).placeholder || ""}
                  value={data[currentQuestion.id] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg p-6"
                />
              )}

              {currentQuestion?.type === "textarea" && (
                <Textarea
                  placeholder={(currentQuestion as any).placeholder || ""}
                  value={data[currentQuestion.id] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg p-6 min-h-32"
                />
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  size="lg"
                  disabled={!data[currentQuestion?.id]}
                >
                  {step === questions.length ? "Complete" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
