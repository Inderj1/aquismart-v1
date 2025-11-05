"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Calendar, FileText, CheckCircle2, Clock, AlertCircle, MessageSquare, DollarSign, TrendingUp, Users, Mail } from "lucide-react";
import Link from "next/link";
import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BuyerPurchasesPage() {
  const [activeTab, setActiveTab] = useState("timeline");
  const activePurchases = [
    {
      id: 1,
      businessName: "SaaS Analytics Platform",
      industry: "Technology",
      location: "San Francisco, CA",
      price: "$12.5M",
      revenue: "$8.2M",
      ebitda: "$2.1M",
      employees: 45,
      status: "Due Diligence",
      progress: 60,
      nextStep: "Review financial documents",
      daysInProcess: 18,
      estimatedClose: "Dec 15, 2024",
      seller: "John Smith",
      timeline: [
        { step: "Initial Interest", completed: true, date: "Oct 15, 2024" },
        { step: "NDA Signed", completed: true, date: "Oct 18, 2024" },
        { step: "Due Diligence", completed: false, inProgress: true, date: "In Progress" },
        { step: "Negotiation", completed: false, date: "Pending" },
        { step: "Closing", completed: false, date: "Pending" }
      ],
      recentActivity: [
        { action: "Financial documents uploaded", date: "2 hours ago" },
        { action: "Called with seller", date: "1 day ago" },
        { action: "Due diligence started", date: "3 days ago" }
      ],
      documents: [
        { name: "Financial Statements 2022-2024", status: "Reviewed" },
        { name: "Customer Contracts", status: "Pending Review" },
        { name: "Employee Agreements", status: "Pending Review" },
        { name: "Tax Returns", status: "Reviewed" }
      ]
    }
  ];

  const completedPurchases = [
    {
      id: 2,
      businessName: "E-commerce Fashion Store",
      industry: "Retail",
      price: "$2.8M",
      completedDate: "Sep 1, 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />

      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard/buyer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">My Business Purchases</h1>
          <p className="text-muted-foreground mt-1">Track your business acquisition transactions and buying journey</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Active Purchases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Active Purchases</h2>
          {activePurchases.length > 0 ? (
            <div className="space-y-6">
              {activePurchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Building2 className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl mb-1">{purchase.businessName}</CardTitle>
                          <CardDescription className="flex items-center gap-3 text-sm">
                            <span>{purchase.industry}</span>
                            <span>•</span>
                            <span>{purchase.location}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{purchase.price}</p>
                        <Badge variant="secondary" className="mt-2">{purchase.status}</Badge>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="bg-background/60 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Revenue</span>
                        </div>
                        <p className="font-semibold">{purchase.revenue}</p>
                      </div>
                      <div className="bg-background/60 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">EBITDA</span>
                        </div>
                        <p className="font-semibold">{purchase.ebitda}</p>
                      </div>
                      <div className="bg-background/60 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Employees</span>
                        </div>
                        <p className="font-semibold">{purchase.employees}</p>
                      </div>
                      <div className="bg-background/60 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Days Active</span>
                        </div>
                        <p className="font-semibold">{purchase.daysInProcess}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Transaction Progress</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-primary">{purchase.progress}%</span>
                          <p className="text-xs text-muted-foreground">Est. close: {purchase.estimatedClose}</p>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all"
                          style={{ width: `${purchase.progress}%` }}
                        />
                      </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                      </TabsList>

                      <TabsContent value="timeline" className="space-y-4 mt-4">
                        {purchase.timeline.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 relative">
                            {index < purchase.timeline.length - 1 && (
                              <div className="absolute left-[10px] top-[28px] w-[2px] h-[calc(100%+8px)] bg-border" />
                            )}
                            {item.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 relative z-10 bg-background" />
                            ) : item.inProgress ? (
                              <Clock className="h-5 w-5 text-primary mt-0.5 animate-pulse relative z-10 bg-background" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 relative z-10 bg-background" />
                            )}
                            <div className="flex-1 pb-4">
                              <p className={`font-medium ${item.completed ? 'text-foreground' : item.inProgress ? 'text-primary' : 'text-muted-foreground'}`}>
                                {item.step}
                              </p>
                              <p className="text-sm text-muted-foreground">{item.date}</p>
                            </div>
                          </div>
                        ))}

                        {/* Next Step */}
                        <div className="mt-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Next Action Required</span>
                          </div>
                          <p className="text-sm">{purchase.nextStep}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="documents" className="space-y-3 mt-4">
                        {purchase.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className={`text-xs ${doc.status === 'Reviewed' ? 'text-green-600' : 'text-orange-600'}`}>
                                  {doc.status}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="activity" className="space-y-3 mt-4">
                        {purchase.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Seller
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Schedule Call
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        All Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No active purchases yet</p>
                <Link href="/marketplace">
                  <Button>Browse Businesses</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completed Purchases */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Completed Purchases</h2>
          {completedPurchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedPurchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle className="text-base">{purchase.businessName}</CardTitle>
                        <CardDescription className="text-xs">{purchase.industry}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">{purchase.price}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>Closed on {purchase.completedDate}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No completed purchases yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
