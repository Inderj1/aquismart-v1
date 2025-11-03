"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Upload, Eye, MessageSquare, TrendingUp, DollarSign, Users, FileText } from "lucide-react";
import Link from "next/link";
import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";

export default function SellerDashboard() {
  const stats = [
    {
      title: "My Listings",
      value: "2",
      change: "1 active, 1 draft",
      icon: FileText,
      trend: "neutral"
    },
    {
      title: "Total Views",
      value: "234",
      change: "+45 this week",
      icon: Eye,
      trend: "up"
    },
    {
      title: "Interested Buyers",
      value: "12",
      change: "3 new inquiries",
      icon: Users,
      trend: "up"
    },
    {
      title: "Estimated Value",
      value: "$15M",
      change: "Based on AI valuation",
      icon: DollarSign,
      trend: "neutral"
    }
  ];

  const myListings = [
    {
      name: "SaaS Analytics Platform",
      status: "Active",
      asking: "$12.5M",
      views: 156,
      inquiries: 8
    },
    {
      name: "E-commerce Store",
      status: "Draft",
      asking: "$2.5M",
      views: 0,
      inquiries: 0
    }
  ];

  const recentInquiries = [
    { buyer: "John D.", business: "SaaS Analytics Platform", message: "Interested in learning more about revenue streams", time: "2 hours ago" },
    { buyer: "Sarah M.", business: "SaaS Analytics Platform", message: "Request for financial documents", time: "1 day ago" },
    { buyer: "Michael R.", business: "SaaS Analytics Platform", message: "Would like to schedule a call", time: "2 days ago" },
    { buyer: "Emily K.", business: "SaaS Analytics Platform", message: "Questions about customer retention", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your business listings and connect with buyers</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/seller/create-listing">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Listing
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
          {/* My Listings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>Your active and draft business listings</CardDescription>
                </div>
                <Link href="/dashboard/seller/listings">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myListings.map((listing, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium">{listing.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          listing.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {listing.inquiries} inquiries
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{listing.asking}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>Messages from buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInquiries.map((inquiry, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{inquiry.buyer}</p>
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{inquiry.message}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.time}</p>
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
            <CardDescription>Manage your business listings and engage with buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/seller/create-listing">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Create Listing</h3>
                  <p className="text-sm text-muted-foreground">
                    List your business for sale
                  </p>
                </div>
              </Link>
              <Link href="/dashboard/seller/valuation">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <DollarSign className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Get Valuation</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered business valuation
                  </p>
                </div>
              </Link>
              <Link href="/dashboard/seller/messages">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <MessageSquare className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Respond to buyer inquiries
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
