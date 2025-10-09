"use client";

import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Sparkles, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function EarlyAccessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interest: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success message
    // In production, this would send data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <main>
        <LpNavbar1 />
        <section className="bg-secondary section-padding-y min-h-[70vh] flex items-center justify-center">
          <div className="container-padding-x container mx-auto">
            <Card className="max-w-2xl mx-auto border-none shadow-lg">
              <CardContent className="p-8 md:p-12 text-center flex flex-col items-center gap-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-3">
                    Welcome to AcquiSmart! 🎉
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Thank you for your interest in joining our early access program.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-6 w-full">
                  <p className="text-foreground mb-4">
                    <strong>What happens next?</strong>
                  </p>
                  <ul className="text-left space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Our team will review your application within 48 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>You'll receive an email with your early access invitation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Get exclusive access to premium features before public launch</span>
                    </li>
                  </ul>
                </div>
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/")}
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer1 />
      </main>
    );
  }

  return (
    <main>
      <LpNavbar1 />

      {/* Hero Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Tagline>Early Access</Tagline>
            <h1 className="heading-xl">
              Get Exclusive Early Access
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Be among the first to experience AcquiSmart's AI-powered business marketplace. Get priority access to verified listings, special pricing, and help shape the future of business acquisition.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <h2 className="heading-lg">
              Early Access Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">
                  Exclusive Access
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get first access to new features, premium listings, and priority support before public launch
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">
                  Special Launch Pricing
                </h3>
                <p className="text-muted-foreground text-sm">
                  Lock in exclusive early adopter pricing with significant discounts on platform fees
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/80 border-none shadow-none">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">
                  Shape the Platform
                </h3>
                <p className="text-muted-foreground text-sm">
                  Provide feedback and influence feature development as we build the future of business acquisition
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto max-w-2xl">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8 md:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Request Early Access
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll be in touch within 48 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization (Optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Corporation"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                  />
                </div>

                {/* Interest */}
                <div className="space-y-2">
                  <Label htmlFor="interest">I'm interested as a... *</Label>
                  <Select
                    required
                    value={formData.interest}
                    onValueChange={(value) => handleChange("interest", value)}
                  >
                    <SelectTrigger id="interest">
                      <SelectValue placeholder="Select your interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer - Looking to acquire a business</SelectItem>
                      <SelectItem value="seller">Seller - Looking to sell my business</SelectItem>
                      <SelectItem value="both">Both - Buyer and Seller</SelectItem>
                      <SelectItem value="investor">Investor/PE Firm</SelectItem>
                      <SelectItem value="advisor">Advisor/Consultant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your acquisition goals, business type, or any questions you have..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full">
                  Request Early Access
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to receive updates about AcquiSmart.
                  We respect your privacy and will never share your information.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer1 />
    </main>
  );
}
