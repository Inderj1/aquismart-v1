"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PropertySearchParams } from "@/lib/api/properties";

interface PropertySearchProps {
  onSearch: (params: PropertySearchParams) => void;
  initialParams?: PropertySearchParams;
}

export function PropertySearch({ onSearch, initialParams = {} }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialParams.q || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertySearchParams>({
    city: initialParams.city || '',
    state: initialParams.state || '',
    minPrice: initialParams.minPrice,
    maxPrice: initialParams.maxPrice,
    bedrooms: initialParams.bedrooms,
    bathrooms: initialParams.bathrooms,
    propertyType: initialParams.propertyType,
  });

  const handleSearch = () => {
    onSearch({
      q: searchQuery,
      ...filters,
    });
  };

  const handleFilterChange = (key: keyof PropertySearchParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      propertyType: undefined,
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., Boston"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="e.g., MA"
                value={filters.state || ''}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                maxLength={2}
              />
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={filters.propertyType || 'any'}
                onValueChange={(value) => handleFilterChange('propertyType', value === 'any' ? undefined : value)}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="single_family">Single Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="multi_family">Multi-Family</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Min Bedrooms</Label>
              <Select
                value={filters.bedrooms?.toString() || 'any'}
                onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? undefined : parseInt(value))}
              >
                <SelectTrigger id="bedrooms">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Price */}
            <div className="space-y-2">
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="No min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="No max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Min Bathrooms</Label>
              <Select
                value={filters.bathrooms?.toString() || 'any'}
                onValueChange={(value) => handleFilterChange('bathrooms', value === 'any' ? undefined : parseFloat(value))}
              >
                <SelectTrigger id="bathrooms">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="1.5">1.5+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="2.5">2.5+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSearch}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
