"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Search, Heart, ShoppingBag, TrendingUp, Building2, FileText } from "lucide-react";
import Link from "next/link";
import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";

export default function BuyerDashboard() {
  const stats = [
    {
      title: "Saved Businesses",
      value: "12",
      change: "+3 this week",
      icon: Heart,
      trend: "up"
    },
    {
      title: "Active Inquiries",
      value: "5",
      change: "2 pending responses",
      icon: FileText,
      trend: "neutral"
    },
    {
      title: "Ongoing Purchases",
      value: "1",
      change: "In inspection phase",
      icon: ShoppingBag,
      trend: "up"
    },
    {
      title: "Total Investment",
      value: "$850K",
      change: "1 active deal",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const savedBusinesses = [
    { name: "SaaS Analytics Platform", industry: "Technology", asking: "$12.5M", matchScore: 95 },
    { name: "Premium Outdoor Gear Store", industry: "E-commerce", asking: "$8M", matchScore: 88 },
    { name: "Medical Billing Services", industry: "Healthcare", asking: "$5.4M", matchScore: 92 }
  ];

  const recentActivity = [
    { action: "Saved business", business: "Mobile App Development Agency", time: "2 hours ago" },
    { action: "Expressed interest", business: "Specialty Coffee Roastery Chain", time: "1 day ago" },
    { action: "Requested information", business: "Custom Packaging Solutions", time: "2 days ago" },
    { action: "Viewed business", business: "SaaS Analytics Platform", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your business acquisition journey</p>
            </div>
            <div className="flex gap-3">
              <Link href="/marketplace">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Businesses
                </Button>
              </Link>
              <Link href="/dashboard/buyer/purchases">
                <Button>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  My Purchases
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-muted-foreground'} mt-1`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Saved Businesses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Saved Businesses</CardTitle>
                  <CardDescription>Your favorited acquisition opportunities</CardDescription>
                </div>
                <Link href="/marketplace/tracking">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedBusinesses.map((business, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Building2 className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{business.name}</p>
                        <p className="text-sm text-muted-foreground">{business.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{business.asking}</p>
                      <p className="text-xs text-green-600">{business.matchScore}% match</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mb-1">{activity.business}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your business acquisition journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/marketplace">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <Search className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Browse Businesses</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore verified business opportunities
                  </p>
                </div>
              </Link>
              <Link href="/marketplace/matches">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Get Matched</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered business recommendations
                  </p>
                </div>
              </Link>
              <Link href="/dashboard/buyer/purchases">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <ShoppingBag className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">My Purchases</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your ongoing transactions
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
