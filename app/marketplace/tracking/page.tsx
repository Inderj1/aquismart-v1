"use client";

import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/businesses/BusinessCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSavedItemsStore } from "@/store/savedItems";

export default function DealTrackingPage() {
  const [activeTab, setActiveTab] = useState("saved");

  // Use Zustand store
  const {
    savedBusinesses: savedDeals,
    contactedBusinesses: contactedDeals,
    starredBusinesses: starredDeals,
    isLoading: loading,
    error,
    fetchSavedBusinesses,
  } = useSavedItemsStore();

  useEffect(() => {
    fetchSavedBusinesses();
  }, [fetchSavedBusinesses]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-3">My Deals</h1>
        <p className="text-muted-foreground">
          Track and manage your saved, contacted, and starred business opportunities
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Saved ({savedDeals.length})
          </TabsTrigger>
          <TabsTrigger value="contacted" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contacted ({contactedDeals.length})
          </TabsTrigger>
          <TabsTrigger value="starred" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Starred ({starredDeals.length})
          </TabsTrigger>
        </TabsList>

        {/* Saved Deals */}
        <TabsContent value="saved" className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          )}

          {savedDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDeals.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't saved any deals yet
              </p>
              <Link href="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Contacted Deals */}
        <TabsContent value="contacted" className="space-y-6">
          {contactedDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactedDeals.map((business) => (
                <div key={business.id} className="relative">
                  <BusinessCard business={business} />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Contacted
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't contacted any sellers yet
              </p>
              <Link href="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Starred Deals */}
        <TabsContent value="starred" className="space-y-6">
          {starredDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {starredDeals.map((business) => (
                <div key={business.id} className="relative">
                  <BusinessCard business={business} />
                  <div className="absolute top-4 right-4">
                    <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't starred any deals yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Star deals to mark them as high priority
              </p>
              <Link href="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/marketplace/matches">
          <Button variant="outline">View My Matches</Button>
        </Link>
        <Link href="/marketplace/profile">
          <Button variant="outline">Update Profile</Button>
        </Link>
        <Link href="/marketplace">
          <Button>Browse All Listings</Button>
        </Link>
      </div>
    </div>
  );
}
