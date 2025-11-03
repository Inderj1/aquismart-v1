"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Bed, Bath, Square, MapPin } from "lucide-react";
import Link from "next/link";
import { Property } from "@/lib/api/properties";
import Image from "next/image";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price?: number) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      single_family: 'Single Family',
      condo: 'Condo',
      townhouse: 'Townhouse',
      multi_family: 'Multi-Family',
      land: 'Land',
      commercial: 'Commercial',
    };
    return labels[type] || type;
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Property Image */}
        <div className="relative h-48 bg-gray-200">
          {property.photos && property.photos.length > 0 ? (
            <Image
              src={property.photos[0]}
              alt={property.address}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Home className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90">
              {getPropertyTypeLabel(property.propertyType)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-2">
            {formatPrice(property.listPrice)}
          </div>

          {/* Address */}
          <div className="flex items-start gap-1 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">{property.address}</div>
              <div className="text-muted-foreground">
                {property.city}, {property.state} {property.zipCode}
              </div>
            </div>
          </div>

          {/* Property Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
