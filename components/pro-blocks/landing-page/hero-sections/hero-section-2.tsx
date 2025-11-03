"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, MapPin, DollarSign, TrendingUp, Sparkles } from "lucide-react";
import { OnboardingQuestionnaire, OnboardingData } from "@/components/businesses/OnboardingQuestionnaire";
import { Business, businessApi } from "@/lib/api/businesses";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HeroSection2() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [featuredDeals, setFeaturedDeals] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedDeals();
  }, []);

  const loadFeaturedDeals = async () => {
    try {
      const response = await businessApi.search({ pageSize: 2 });
      setFeaturedDeals(response.data.slice(0, 2));
    } catch (err) {
      console.error('Error loading featured deals:', err);
      // Use mock data as fallback
      setFeaturedDeals([
        {
          id: '1',
          name: 'Profitable SaaS Platform',
          industry: 'Technology',
          location: 'San Francisco, CA',
          askingPrice: 2500000,
          revenue: 1200000,
          description: 'Established B2B SaaS platform with recurring revenue and strong customer retention',
          yearEstablished: 2018,
          status: 'active' as const
        },
        {
          id: '2',
          name: 'E-commerce Fashion Brand',
          industry: 'Retail',
          location: 'New York, NY',
          askingPrice: 850000,
          revenue: 650000,
          description: 'Growing online fashion retailer with loyal customer base and profitable operations',
          yearEstablished: 2020,
          status: 'active' as const
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      const profileData = {
        id: 'mock-profile-id',
        userType: data.userType,
        industry: data.industry,
        location: data.location,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('buyerProfile', JSON.stringify(profileData));
      }

      setShowOnboarding(false);
      router.push('/marketplace/matches');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    }
  };

  if (showOnboarding) {
    return (
      <OnboardingQuestionnaire
        onComplete={handleOnboardingComplete}
        onSkip={() => setShowOnboarding(false)}
      />
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section
      className="bg-gradient-to-b from-secondary via-secondary to-background py-8"
      aria-labelledby="hero-heading"
    >
      <div className="container-padding-x container mx-auto">
        {/* Hero Header - Centered */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h1 id="hero-heading" className="text-3xl md:text-4xl font-bold mb-3">
            Find Your Perfect Business Match
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            AI-powered marketplace connecting serious buyers with verified sellers
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6 max-w-6xl mx-auto items-stretch">
          {/* Featured Deals Column */}
          <div className="space-y-3 flex flex-col h-full">
            <h2 className="text-xl font-bold">Featured Opportunities</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              featuredDeals.map((deal, index) => (
                <Link key={deal.id} href={`/marketplace/${deal.id}`}>
                  <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary bg-background/80 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full shrink-0">
                          <Info className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-base font-bold line-clamp-1">{deal.name}</h3>
                            <Badge variant="secondary" className="text-xs">{deal.industry}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {deal.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{deal.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span className="font-semibold text-xs">{formatCurrency(deal.askingPrice)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{formatCurrency(deal.revenue)}/yr</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>

          {/* Video Column */}
          <div className="relative w-full h-full min-h-[300px] overflow-hidden rounded-xl shadow-lg">
            <video
              src="/video1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* CTA Section - Centered Below */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-2xl mx-auto mb-6">
          <p className="text-base font-medium text-foreground">
            Tell us more to find a perfect match for your next goal
          </p>
          <Button
            size="lg"
            className="px-8 py-4"
            onClick={() => setShowOnboarding(true)}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Get Matched
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">95%</div>
            <div className="text-xs text-muted-foreground">AI Matching Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-xs text-muted-foreground">ML-Powered Fraud Detection</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">Secure</div>
            <div className="text-xs text-muted-foreground">NDA Workflows</div>
          </div>
        </div>
      </div>
    </section>
  );
}
