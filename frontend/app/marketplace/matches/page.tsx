"use client";

import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/businesses/BusinessCard";
import { Button } from "@/components/ui/button";
import { Business, businessApi } from "@/lib/api/businesses";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the backend API
      const response = await businessApi.getMatches();
      setMatches(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Finding your perfect matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadMatches}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Link href="/marketplace">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          <Link href="/marketplace/expert-mode">
            <Button size="lg" variant="default" className="font-semibold">
              EXPERT MODE
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Your AI-Powered Matches</h1>
        </div>
        <p className="text-muted-foreground text-base">
          Based on your preferences, we've found {matches.length} businesses that match your criteria.
          Each match score is calculated using AI to analyze industry fit, location, and financial alignment.
        </p>
      </div>

      {/* Top 3 Matches */}
      {matches.length > 0 ? (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Here are recommendations closely matched with your interest</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.slice(0, 3).map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                showMatchScore={true}
              />
            ))}
          </div>

        </>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-4">
            No matches found based on your current preferences.
          </p>
          <Link href="/marketplace/profile">
            <Button>Update Your Preferences</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
