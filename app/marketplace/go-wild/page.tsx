"use client";

import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/businesses/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Business, businessApi } from "@/lib/api/businesses";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";

interface QuestionnaireData {
  userType: string;
  budget?: string;
  industries?: string;
  location?: string;
  businessSize?: string;
  revenuePreference?: string;
  profitability?: string;
  [key: string]: any;
}

export default function GoWildPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [profileData, setProfileData] = useState<QuestionnaireData | null>(null);

  useEffect(() => {
    // Load expert mode profile from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('expertModeProfile');
      if (stored) {
        setProfileData(JSON.parse(stored));
      }
    }
    loadFilteredBusinesses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    } else {
      setFilteredBusinesses(businesses);
    }
  }, [searchTerm, businesses]);

  const calculateMatchScore = (business: Business): number => {
    if (!profileData) return Math.floor(Math.random() * 20) + 60; // Random 60-80% if no profile

    let score = 0;
    let factors = 0;

    // Budget match
    if (profileData.budget) {
      factors++;
      const budgetRanges: { [key: string]: [number, number] } = {
        "Under $500K": [0, 500000],
        "$500K - $1M": [500000, 1000000],
        "$1M - $5M": [1000000, 5000000],
        "$5M - $10M": [5000000, 10000000],
        "Over $10M": [10000000, 100000000]
      };
      const range = budgetRanges[profileData.budget];
      if (range && business.askingPrice >= range[0] && business.askingPrice <= range[1]) {
        score += 25;
      } else if (range && Math.abs(business.askingPrice - range[1]) / range[1] < 0.3) {
        score += 15; // Close match
      }
    }

    // Industry match
    if (profileData.industries) {
      factors++;
      if (profileData.industries === "Multiple industries" || profileData.industries === business.industry) {
        score += 25;
      } else if (business.industry.toLowerCase().includes(profileData.industries.toLowerCase().split(' ')[0])) {
        score += 15;
      }
    }

    // Location match
    if (profileData.location) {
      factors++;
      if (profileData.location === "Remote/Nationwide" || profileData.location === "Other") {
        score += 15;
      } else if (business.location.includes(profileData.location.split(',')[0])) {
        score += 25;
      } else {
        score += 10;
      }
    }

    // Revenue preference match
    if (profileData.revenuePreference && profileData.revenuePreference !== "No preference") {
      factors++;
      const revenueRanges: { [key: string]: [number, number] } = {
        "Under $500K": [0, 500000],
        "$500K - $1M": [500000, 1000000],
        "$1M - $5M": [1000000, 5000000],
        "$5M - $10M": [5000000, 10000000],
        "$10M+": [10000000, 100000000]
      };
      const range = revenueRanges[profileData.revenuePreference];
      if (range && business.revenue >= range[0] && business.revenue <= range[1]) {
        score += 25;
      } else if (range && Math.abs(business.revenue - range[1]) / range[1] < 0.3) {
        score += 15;
      }
    }

    return factors > 0 ? Math.min(Math.round(score / factors * 4), 95) : 65;
  };

  const loadFilteredBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessApi.search({ pageSize: 100 });

      // Calculate match scores for all businesses
      const businessesWithScores = response.data.map(business => ({
        ...business,
        matchScore: calculateMatchScore(business)
      }));

      // Filter businesses with match score >= 60% and sort by match score
      const filtered = businessesWithScores
        .filter(b => (b.matchScore || 0) >= 60)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 30); // Show top 30 matches

      setBusinesses(filtered);
      setFilteredBusinesses(filtered);
    } catch (err: any) {
      setError(err.message || 'Failed to load businesses');
      console.error('Error loading businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LpNavbar1 />
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading all available businesses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <LpNavbar1 />
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadAllBusinesses}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/marketplace/matches">
            <Button variant="ghost" className="mb-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Matches
            </Button>
          </Link>

          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Go Wild - Curated Matches</h1>
            <p className="text-muted-foreground text-base">
              Based on your expert mode profile, we've curated {businesses.length} businesses with 60%+ match scores.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, industry, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBusinesses.length} of {businesses.length} businesses
          </p>
        </div>

        {/* Businesses Grid */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                showMatchScore={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-4">
              No businesses found matching your search.
            </p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        )}

        {/* Back to Matches CTA */}
        <div className="mt-12 text-center border-t pt-8">
          <p className="text-muted-foreground mb-4">
            Want to see businesses that better match your preferences?
          </p>
          <Link href="/marketplace/matches">
            <Button>View Your Matches</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
