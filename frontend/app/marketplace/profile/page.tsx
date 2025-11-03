"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BuyerProfile, businessApi } from "@/lib/api/businesses";
import { ArrowLeft, Save, User } from "lucide-react";
import Link from "next/link";

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Retail",
  "Food & Beverage",
  "Manufacturing",
  "Real Estate",
  "Professional Services",
  "Financial Services",
  "Education",
  "Construction",
  "Transportation",
  "Hospitality",
  "Other",
];

const LOCATIONS = [
  "Boston, MA",
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
  "Miami, FL",
  "Denver, CO",
  "Atlanta, GA",
];

const EXPERIENCE_LEVELS = [
  "First-time buyer",
  "Some experience",
  "Experienced entrepreneur",
  "Serial entrepreneur",
];

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    userType: 'buy' as 'buy' | 'sell',
    industry: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    experienceLevel: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Mock data until backend is ready
      // In production: const response = await businessApi.getBuyerProfile();

      // Check if there's a saved profile in localStorage
      const savedProfile = typeof window !== 'undefined'
        ? localStorage.getItem('buyerProfile')
        : null;

      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setProfile(profileData);
        setFormData({
          userType: profileData.userType,
          industry: profileData.industry,
          location: profileData.location,
          budgetMin: profileData.budgetMin?.toString() || '',
          budgetMax: profileData.budgetMax?.toString() || '',
          experienceLevel: profileData.experienceLevel || '',
        });
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData: Partial<BuyerProfile> = {
        id: profile?.id || 'mock-profile-id',
        userType: formData.userType,
        industry: formData.industry,
        location: formData.location,
        budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : undefined,
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined,
        experienceLevel: formData.experienceLevel || undefined,
      };

      // Mock save until backend is ready
      // In production: const response = profile ? await businessApi.updateBuyerProfile(updateData) : await businessApi.createBuyerProfile(updateData);

      // Save to localStorage for now
      if (typeof window !== 'undefined') {
        localStorage.setItem('buyerProfile', JSON.stringify(updateData));
      }

      setProfile(updateData as BuyerProfile);
      alert('Profile saved successfully!');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      alert(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Buyer Profile</h1>
        </div>
        <p className="text-muted-foreground">
          Update your preferences to get better business matches
        </p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
          <CardDescription>
            Tell us what you're looking for so we can recommend the best opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Type */}
          <div className="space-y-2">
            <Label htmlFor="userType">I want to</Label>
            <Select
              value={formData.userType}
              onValueChange={(value) => handleChange('userType', value)}
            >
              <SelectTrigger id="userType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy a business</SelectItem>
                <SelectItem value="sell">Sell a business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Preferred Industry</Label>
            <Select
              value={formData.industry || 'none'}
              onValueChange={(value) => handleChange('industry', value === 'none' ? '' : value)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select an industry</SelectItem>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Preferred Location</Label>
            <Select
              value={formData.location || 'none'}
              onValueChange={(value) => handleChange('location', value === 'none' ? '' : value)}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a location</SelectItem>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          {formData.userType === 'buy' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Minimum Budget</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    placeholder="e.g., 100000"
                    value={formData.budgetMin}
                    onChange={(e) => handleChange('budgetMin', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Maximum Budget</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.budgetMax}
                    onChange={(e) => handleChange('budgetMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={formData.experienceLevel || 'none'}
                  onValueChange={(value) => handleChange('experienceLevel', value === 'none' ? '' : value)}
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select your experience level</SelectItem>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="pt-4">
            <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Actions */}
      {profile && (
        <div className="mt-8 flex gap-4">
          <Link href="/marketplace/matches" className="flex-1">
            <Button variant="outline" className="w-full">
              View My Matches
            </Button>
          </Link>
          <Link href="/marketplace" className="flex-1">
            <Button variant="outline" className="w-full">
              Browse All Listings
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
