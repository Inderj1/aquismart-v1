"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, TrendingUp, Star, Lock, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useProfileStore } from "@/store/profile";
import { useSavedItemsStore } from "@/store/savedItems";
import { Business } from "@/lib/api/businesses";

export type { Business };

interface BusinessCardProps {
  business: Business;
  showMatchScore?: boolean;
  showSaveButton?: boolean;
}

export function BusinessCard({ business, showMatchScore = false, showSaveButton = true }: BusinessCardProps) {
  const { hasProfile, initializeProfile } = useProfileStore();
  const { isSaved, toggleSaved, isStarred, toggleStarred } = useSavedItemsStore();

  const isBusinessSaved = isSaved(business.id);
  const isBusinessStarred = isStarred(business.id);
  const profileExists = hasProfile();

  useEffect(() => {
    initializeProfile();
  }, [initializeProfile]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSaved(business);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStarred(business);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-36 bg-muted">
        {business.images && business.images.length > 0 ? (
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {business.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-xs">
            Featured
          </Badge>
        )}
        {showMatchScore && business.matchScore && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-xs">
            <Star className="h-3 w-3 mr-1" />
            {business.matchScore}% Match
          </Badge>
        )}
        {/* Save/Star buttons */}
        {showSaveButton && profileExists && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={handleSaveClick}
              className="p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
              title={isBusinessSaved ? "Remove from saved" : "Save business"}
            >
              <Heart
                className={`h-4 w-4 ${isBusinessSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
              />
            </button>
            <button
              onClick={handleStarClick}
              className="p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
              title={isBusinessStarred ? "Unstar" : "Star as priority"}
            >
              <Star
                className={`h-4 w-4 ${isBusinessStarred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
              />
            </button>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title and Industry */}
        <div className="mb-2">
          <h3 className="font-semibold text-base mb-1 line-clamp-1">{business.name}</h3>
          <Badge variant="outline" className="text-xs">{business.industry}</Badge>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="text-xs">{business.location}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {business.description}
        </p>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b">
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3 mr-1" />
              Asking Price
            </div>
            <div className="font-semibold text-sm">{formatCurrency(business.askingPrice)}</div>
          </div>
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Revenue
            </div>
            {profileExists ? (
              <div className="font-semibold text-sm">{formatCurrency(business.revenue)}</div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <Lock className="h-3 w-3 mr-1" />
                <span>Not Disclosed</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>Est. {business.yearEstablished}</span>
          {business.employees && <span>{business.employees} employees</span>}
        </div>

        {/* Action Button */}
        {profileExists ? (
          <Link href={`/marketplace/${business.id}`} className="w-full">
            <Button variant="secondary" className="w-full font-medium" size="sm">View Details</Button>
          </Link>
        ) : (
          <Link href="/marketplace/welcome" className="w-full">
            <Button className="w-full font-medium" size="sm">
              <Lock className="h-3 w-3 mr-1" />
              Sign Up to View
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
