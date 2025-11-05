"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Business, businessApi } from "@/lib/api/businesses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Star,
  Heart,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  FileText,
  UserCheck,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isInterestExpressed, setIsInterestExpressed] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadBusiness(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('welcomeProfile') || localStorage.getItem('buyerProfile');
      setHasProfile(!!profile);
    }
  }, []);

  const loadBusiness = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Use the backend API
      const response = await businessApi.getById(id);
      setBusiness(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load business');
      console.error('Error loading business:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessOld = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Old mock data - keeping as fallback
      const mockBusinesses: Record<string, Business> = {
        '1': {
          id: '1',
          name: 'B2B Marketing Automation Platform',
          industry: 'SaaS',
          location: 'Austin, TX',
          askingPrice: 12500000,
          revenue: 2500000,
          ebitda: 1250000,
          description: 'A thriving B2B marketing automation platform serving mid-market companies. The platform helps businesses automate their email campaigns, lead nurturing, and customer engagement workflows. Built with modern tech stack and has strong recurring revenue with excellent retention rates.\n\nThe business has shown consistent 40% YoY growth over the past 3 years with minimal churn. Strong product-market fit with 200+ enterprise clients.',
          yearEstablished: 2018,
          employees: 25,
          matchScore: 95,
          isFeatured: true,
          images: [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
            'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
          ],
          status: 'active',
          financials: {
            cashFlow: 1000000,
            assets: 3000000,
            liabilities: 500000,
          },
          highlights: [
            '200+ enterprise clients with 95% retention rate',
            '40% YoY growth over the past 3 years',
            'Modern tech stack with scalable infrastructure',
            'Recurring revenue model with annual contracts',
            'Strong brand presence in the industry',
            'Experienced team willing to stay through transition',
          ],
          reasonForSelling: 'Founder looking to pursue a new venture. The business is profitable and growing, but the current owner wants to explore opportunities in a different industry.',
        },
        '2': {
          id: '2',
          name: 'Premium Outdoor Gear Store',
          industry: 'E-commerce',
          location: 'Denver, CO',
          askingPrice: 8000000,
          revenue: 3200000,
          ebitda: 960000,
          description: 'Established e-commerce business specializing in premium outdoor gear and equipment. Strong brand loyalty with an engaged customer base of outdoor enthusiasts. Excellent margins on curated product selection.\n\nMultiple revenue streams including direct sales, affiliate partnerships, and sponsored content.',
          yearEstablished: 2015,
          employees: 12,
          matchScore: 88,
          isFeatured: true,
          images: [
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
            'https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=600&q=80',
          ],
          status: 'active',
          financials: {
            cashFlow: 850000,
            assets: 2500000,
            liabilities: 400000,
          },
          highlights: [
            '50,000+ active customers with repeat purchase rate of 65%',
            'Strong social media presence (100K+ followers)',
            'Diversified supplier relationships',
            'Owned warehouse and inventory system',
            'Established relationships with top brands',
          ],
          reasonForSelling: 'Owner relocating out of state for family reasons.',
        },
        '3': {
          id: '3',
          name: 'Medical Billing Services',
          industry: 'Healthcare',
          location: 'Phoenix, AZ',
          askingPrice: 5400000,
          revenue: 1800000,
          ebitda: 720000,
          description: 'Professional medical billing and coding services company serving healthcare providers across multiple states. Excellent relationships with insurance companies and a proven track record of maximizing reimbursements for clients.',
          yearEstablished: 2012,
          employees: 35,
          matchScore: 92,
          isFeatured: true,
          images: [
            'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80',
          ],
          status: 'active',
          financials: {
            cashFlow: 650000,
            assets: 1500000,
            liabilities: 300000,
          },
          highlights: [
            '75+ healthcare provider clients',
            'Average client relationship of 8+ years',
            'HIPAA compliant systems and processes',
            'Experienced and certified billing specialists',
            'Proprietary software for claims management',
          ],
          reasonForSelling: 'Retirement - owner has built the business over 12 years and is ready to exit.',
        },
      };

      const business = mockBusinesses[id];
      if (!business) {
        throw new Error('Business not found');
      }

      setBusiness(business);
    } catch (err: any) {
      setError(err.message || 'Failed to load business');
      console.error('Error loading business:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!business) return;
    try {
      if (isSaved) {
        await businessApi.unsave(business.id);
        setIsSaved(false);
      } else {
        await businessApi.save(business.id);
        setIsSaved(true);
      }
    } catch (err: any) {
      console.error('Error saving business:', err);
      alert(err.message || 'Failed to save business');
    }
  };

  const handleExpressInterest = async () => {
    if (!business) return;
    try {
      await businessApi.expressInterest(business.id, 'I am interested in learning more about this opportunity.');
      setIsInterestExpressed(true);
      alert('Interest expressed! The seller will be notified.');
    } catch (err: any) {
      console.error('Error expressing interest:', err);
      alert(err.message || 'Failed to express interest. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  if (error || !business) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-destructive mb-4">{error || 'Business not found'}</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Back Button */}
      <Link href="/marketplace">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{business.industry}</Badge>
                  {business.isFeatured && (
                    <Badge className="bg-yellow-500">Featured</Badge>
                  )}
                  {business.matchScore && (
                    <Badge className="bg-green-600">
                      <Star className="h-3 w-3 mr-1" />
                      {business.matchScore}% Match
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {business.location}
                </div>
              </div>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="icon"
                onClick={handleSave}
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Images */}
          {business.images && business.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {business.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative ${index === 0 ? "col-span-2" : ""} h-64 bg-muted rounded-lg overflow-hidden`}
                >
                  <img
                    src={image}
                    alt={`${business.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Business</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {business.description}
              </p>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              {!hasProfile && (
                <p className="text-sm text-muted-foreground">
                  Sign up to view revenue and profitability details
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Asking Price
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(business.askingPrice)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Annual Revenue
                  </div>
                  {hasProfile ? (
                    <div className="text-2xl font-bold">
                      {formatCurrency(business.revenue)}
                    </div>
                  ) : (
                    <div className="flex items-center text-lg text-muted-foreground">
                      <Lock className="h-4 w-4 mr-2" />
                      Not Disclosed
                    </div>
                  )}
                </div>
                {business.ebitda && (
                  <div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      EBITDA
                    </div>
                    {hasProfile ? (
                      <div className="text-2xl font-bold">
                        {formatCurrency(business.ebitda)}
                      </div>
                    ) : (
                      <div className="flex items-center text-lg text-muted-foreground">
                        <Lock className="h-4 w-4 mr-2" />
                        Not Disclosed
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!hasProfile && (
                <div className="pt-6 border-t mt-6">
                  <Link href="/marketplace/welcome">
                    <Button className="w-full" size="lg">
                      <Lock className="h-4 w-4 mr-2" />
                      Sign Up to View Revenue & EBITDA
                    </Button>
                  </Link>
                </div>
              )}
              {hasProfile && business.financials && (
                <>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {business.financials.cashFlow && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Cash Flow</div>
                        <div className="font-semibold">
                          {formatCurrency(business.financials.cashFlow)}
                        </div>
                      </div>
                    )}
                    {business.financials.assets && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Assets</div>
                        <div className="font-semibold">
                          {formatCurrency(business.financials.assets)}
                        </div>
                      </div>
                    )}
                    {business.financials.liabilities && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Liabilities</div>
                        <div className="font-semibold">
                          {formatCurrency(business.financials.liabilities)}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Year Established</div>
                    <div className="font-semibold">{business.yearEstablished}</div>
                  </div>
                </div>
                {business.employees && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Employees</div>
                      <div className="font-semibold">{business.employees}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Industry</div>
                    <div className="font-semibold">{business.industry}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          {business.highlights && business.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {business.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Reason for Selling */}
          {business.reasonForSelling && (
            <Card>
              <CardHeader>
                <CardTitle>Reason for Selling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{business.reasonForSelling}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Next Steps */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Take action to move forward with this opportunity
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasProfile ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleExpressInterest}
                  disabled={isInterestExpressed}
                >
                  {isInterestExpressed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Interest Expressed
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Express Interest
                    </>
                  )}
                </Button>
              ) : (
                <Link href="/marketplace/welcome">
                  <Button className="w-full" size="lg">
                    <Lock className="h-4 w-4 mr-2" />
                    Sign Up to Express Interest
                  </Button>
                </Link>
              )}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Recommended Actions</h4>

                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Talk to a CPA</div>
                      <div className="text-xs text-muted-foreground">
                        Review financials & tax implications
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Contact Your Bank</div>
                      <div className="text-xs text-muted-foreground">
                        Explore financing options
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Review Documents</div>
                      <div className="text-xs text-muted-foreground">
                        Request due diligence materials
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Hire an Attorney</div>
                      <div className="text-xs text-muted-foreground">
                        Legal review & contract support
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <Button variant="outline" className="w-full" onClick={handleSave}>
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? 'Saved' : 'Save for Later'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
