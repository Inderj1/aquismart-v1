"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface OnboardingData {
  userType: 'buy' | 'sell' | '';
  industry: string;
  location: string;
}

interface OnboardingQuestionnaireProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
  onBack?: () => void;
}

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

export function OnboardingQuestionnaire({ onComplete, onSkip, onBack }: OnboardingQuestionnaireProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    userType: '',
    industry: '',
    location: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.userType !== '';
      case 2:
        return data.industry !== '';
      case 3:
        return data.location !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background p-6 pt-20 relative z-0">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question content */}
        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">What do you want to do?</h2>
                <p className="text-muted-foreground">
                  Tell us about your goals so we can personalize your experience
                </p>
              </div>
              <RadioGroup
                value={data.userType}
                onValueChange={(value) => setData({ ...data, userType: value as 'buy' | 'sell' })}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary cursor-pointer">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Buy a business</div>
                    <div className="text-sm text-muted-foreground">
                      Find and acquire the perfect business opportunity
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary cursor-pointer">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Sell a business</div>
                    <div className="text-sm text-muted-foreground">
                      List your business and connect with qualified buyers
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">What industry interests you?</h2>
                <p className="text-muted-foreground">
                  {data.userType === 'buy'
                    ? "We'll show you businesses in your preferred industry"
                    : "Help us categorize your business listing"}
                </p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="industry">Select Industry</Label>
                <Select
                  value={data.industry || 'none'}
                  onValueChange={(value) => setData({ ...data, industry: value === 'none' ? '' : value })}
                >
                  <SelectTrigger id="industry" className="w-full">
                    <SelectValue placeholder="Choose an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose an industry</SelectItem>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Where are you located?</h2>
                <p className="text-muted-foreground">
                  {data.userType === 'buy'
                    ? "We'll prioritize businesses in your area"
                    : "Let buyers know where your business is located"}
                </p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="location">Select Location</Label>
                <Select
                  value={data.location || 'none'}
                  onValueChange={(value) => setData({ ...data, location: value === 'none' ? '' : value })}
                >
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue placeholder="Choose a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose a location</SelectItem>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-32"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-32"
          >
            {step === totalSteps ? 'Finish' : 'Next'}
            {step < totalSteps && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
