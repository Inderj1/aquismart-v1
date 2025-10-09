import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, DollarSign, TrendingUp, Shield, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MarketplacePage() {
  const listings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
      category: "SaaS",
      title: "B2B Marketing Automation Platform",
      location: "Austin, TX",
      revenue: "$2.5M ARR",
      price: "$12.5M",
      matchScore: 95,
      verified: true,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
      category: "E-commerce",
      title: "Premium Outdoor Gear Store",
      location: "Denver, CO",
      revenue: "$3.2M/year",
      price: "$8M",
      matchScore: 88,
      verified: true,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80",
      category: "Healthcare",
      title: "Medical Billing Services",
      location: "Phoenix, AZ",
      revenue: "$1.8M/year",
      price: "$5.4M",
      matchScore: 92,
      verified: true,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&q=80",
      category: "Manufacturing",
      title: "Custom Packaging Solutions",
      location: "Chicago, IL",
      revenue: "$4.1M/year",
      price: "$15M",
      matchScore: 85,
      verified: true,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1554224311-beee4c2e7e38?w=600&q=80",
      category: "Food & Beverage",
      title: "Specialty Coffee Roastery Chain",
      location: "Seattle, WA",
      revenue: "$2.8M/year",
      price: "$7.5M",
      matchScore: 90,
      verified: true,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
      category: "Technology",
      title: "Mobile App Development Agency",
      location: "San Francisco, CA",
      revenue: "$1.5M/year",
      price: "$4.5M",
      matchScore: 87,
      verified: true,
    },
  ];

  const categories = [
    "All Industries",
    "SaaS & Software",
    "E-commerce",
    "Healthcare",
    "Manufacturing",
    "Food & Beverage",
    "Professional Services",
    "Technology",
    "Real Estate",
  ];

  return (
    <main>
      <LpNavbar1 />

      {/* Hero Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Tagline>Marketplace</Tagline>
            <h1 className="heading-xl">
              Discover Verified Business Opportunities
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Browse our curated marketplace of pre-vetted businesses. Every listing is verified with ML-powered fraud detection and credibility scoring.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-background rounded-lg p-2 flex gap-2 shadow-sm border">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by industry, location, or keywords..."
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
              </div>
              <Button>Search</Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Featured Listings
              </h2>
              <p className="text-muted-foreground">
                {listings.length} verified businesses available
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort by
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  {listing.verified && (
                    <div className="absolute top-3 right-3 bg-background/95 rounded-full p-1.5">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/95 text-foreground hover:bg-background/95">
                      {listing.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{listing.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">
                        {listing.revenue}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">
                        {listing.price}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                      <span className="text-sm font-medium text-foreground">
                        {listing.matchScore}% Match
                      </span>
                    </div>
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg">
              Load More Listings
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-secondary section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Trust & Security</Tagline>
            <h2 className="heading-lg">
              Every Listing is Verified and Protected
            </h2>
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
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <h2 className="heading-lg max-w-2xl">
              Ready to Find Your Perfect Business Match?
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Create your buyer profile and get personalized matches based on your acquisition criteria, budget, and experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg">Create Buyer Profile</Button>
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
