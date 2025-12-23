"use client";

import { useEffect, useState } from "react";
import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Shield, Star, Sparkles, Heart, FolderOpen } from "lucide-react";
import Link from "next/link";
import { OnboardingQuestionnaire, OnboardingData } from "@/components/businesses/OnboardingQuestionnaire";
import { BusinessCard } from "@/components/businesses/BusinessCard";
import { useRouter } from "next/navigation";
import { useBusinessStore } from "@/store/business";
import { useSearchStore, INDUSTRY_CATEGORIES } from "@/store/search";
import { useProfileStore } from "@/store/profile";

export default function MarketplacePage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Use Zustand stores
  const { businesses, isLoading: loading, fetchBusinesses } = useBusinessStore();
  const { query: searchQuery, setQuery: setSearchQuery, filters, setFilter, addRecentSearch } = useSearchStore();
  const { saveOnboardingData } = useProfileStore();

  const selectedCategory = filters.industry;

  useEffect(() => {
    // Fetch businesses when category changes
    const params = selectedCategory !== "All Industries" ? { industry: selectedCategory } : undefined;
    fetchBusinesses(params);
  }, [selectedCategory, fetchBusinesses]);

  useEffect(() => {
    if (showOnboarding && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showOnboarding]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Save to profile store
      saveOnboardingData(data);

      setShowOnboarding(false);

      // Redirect based on user type
      if (data.userType === 'buy') {
        router.push('/dashboard/buyer');
      } else if (data.userType === 'sell') {
        router.push('/dashboard/seller');
      } else {
        router.push('/marketplace/matches');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      // Trigger search with current query
      fetchBusinesses({ q: searchQuery, industry: selectedCategory !== "All Industries" ? selectedCategory : undefined });
    }
  };

  const handleCategoryChange = (category: string) => {
    setFilter('industry', category);
  };

  if (showOnboarding) {
    return (
      <main>
        <LpNavbar1 />
        <OnboardingQuestionnaire
          onComplete={handleOnboardingComplete}
          onSkip={() => setShowOnboarding(false)}
          onBack={() => setShowOnboarding(false)}
        />
      </main>
    );
  }

  return (
    <main>
      <LpNavbar1 />

      {/* Compact Hero Section */}
      <section className="bg-secondary border-b py-8">
        <div className="container-padding-x container mx-auto">
          {/* Header with Actions - Single Row on Desktop */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">Business Marketplace</h1>
                <Badge variant="outline" className="hidden md:inline-flex">
                  {loading ? "..." : `${businesses.length} listings`}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">
                AI-verified opportunities from startups to established enterprises
              </p>
            </div>

            {/* Quick Actions - Compact */}
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <Button onClick={() => setShowOnboarding(true)} className="flex-1 lg:flex-initial">
                <Sparkles className="h-4 w-4 mr-2" />
                Get Matches
              </Button>
              <Link href="/marketplace/tracking" className="flex-1 lg:flex-initial">
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Saved</span>
                  <span className="sm:hidden">Saved</span>
                </Button>
              </Link>
              <Link href="/marketplace/profile" className="flex-1 lg:flex-initial">
                <Button variant="outline" className="w-full">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Profile</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar - More Compact */}
          <div className="max-w-4xl">
            <div className="bg-background rounded-lg p-1.5 flex gap-2 shadow-sm border">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by industry, location, or keywords..."
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} size="sm">Search</Button>
            </div>
          </div>

          {/* Quick Filters - More Compact */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {INDUSTRY_CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs px-2.5 py-1"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-background py-8 border-b">
        <div className="container-padding-x container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {selectedCategory === "All Industries" ? "All Listings" : selectedCategory}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    showMatchScore={false}
                  />
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <Button variant="outline" size="lg">
                  Load More Listings
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-secondary py-12 border-b">
        <div className="container-padding-x container mx-auto">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Every Listing is Verified and Protected
            </h2>
            <p className="text-sm text-muted-foreground">AI-powered fraud detection and credibility scoring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold text-lg">
                ML-Powered Verification
              </h3>
              <p className="text-sm text-muted-foreground">
                Every seller identity, business document, and financial record is verified using advanced machine learning algorithms
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold text-lg">
                Credibility Scores
              </h3>
              <p className="text-sm text-muted-foreground">
                Each listing receives a credibility score based on verification status, seller history, and business documentation quality
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold text-lg">
                Automated Valuations
              </h3>
              <p className="text-sm text-muted-foreground">
                Industry-benchmarked valuations help you assess fair market value and identify promising opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-12">
        <div className="container-padding-x container mx-auto">
          <div className="bg-primary/5 rounded-xl p-8 flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">
                Find Your Perfect Business Match
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-xl">
              Answer 3 quick questions and get AI-powered recommendations based on your criteria
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => setShowOnboarding(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Get Matched Now
              </Button>
              <Link href="/platform">
                <Button size="lg" variant="outline">Learn How It Works</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </main>
  );
}
