"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, FileText, TrendingUp, AlertCircle, DollarSign, Building2, Upload, Search } from "lucide-react";
import Link from "next/link";
import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Portfolio Value",
      value: "$1.2B",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Investments",
      value: "47",
      change: "+3 this month",
      icon: Building2,
      trend: "up"
    },
    {
      title: "Documents Processed",
      value: "1,247",
      change: "+156 this week",
      icon: FileText,
      trend: "up"
    },
    {
      title: "Pending Reviews",
      value: "12",
      change: "2 urgent",
      icon: AlertCircle,
      trend: "neutral"
    }
  ];

  const recentDocuments = [
    { name: "Q3 2024 Capital Account - Fund VII", status: "Processed", date: "2 hours ago", confidence: 98 },
    { name: "Quarterly Financials - TechCo", status: "Review Required", date: "5 hours ago", confidence: 87 },
    { name: "Loan Agreement - ABC Industries", status: "Processing", date: "1 day ago", confidence: null },
    { name: "Covenant Calculations - XYZ Corp", status: "Approved", date: "2 days ago", confidence: 95 }
  ];

  const pendingTasks = [
    { title: "Review TechCo Valuation", priority: "High", dueDate: "Today" },
    { title: "Approve Q3 Capital Accounts", priority: "Medium", dueDate: "Tomorrow" },
    { title: "Reconcile Fund VII KPIs", priority: "High", dueDate: "Today" },
    { title: "Update Portfolio Company Data", priority: "Low", dueDate: "This Week" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LpNavbar1 />
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, Monitor your portfolio and AI insights</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/upload">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </Link>
              <Link href="/dashboard/search">
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  AI Search
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
          {/* Recent Documents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>AI-processed documents and extractions</CardDescription>
                </div>
                <Link href="/dashboard/documents">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {doc.confidence && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{doc.confidence}% confident</p>
                          <div className="w-24 h-2 bg-secondary rounded-full mt-1">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${doc.confidence}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'Processed' ? 'bg-green-100 text-green-700' :
                        doc.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                        doc.status === 'Review Required' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{task.title}</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Property Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Saved Properties Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Saved Properties</CardTitle>
                  <CardDescription>Properties you've saved for review and valuation</CardDescription>
                </div>
                <Link href="/properties">
                  <Button variant="outline" size="sm">
                    Browse Properties
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">No saved properties yet</p>
                <p className="text-sm">Start exploring properties and save your favorites</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Purchases Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Business Purchases</CardTitle>
                  <CardDescription>Track your business acquisition transactions and buying journey</CardDescription>
                </div>
                <Link href="/properties/my-purchases">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">No active purchases</p>
                <p className="text-sm">Start a business acquisition to track your journey</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>AI-Powered Features</CardTitle>
            <CardDescription>Leverage AI for intelligent document processing and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/properties">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <Building2 className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Property Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Search and valuate properties with AI
                  </p>
                </div>
              </Link>
              <Link href="/dashboard/upload">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Upload & Extract</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered OCR and field extraction from GP documents
                  </p>
                </div>
              </Link>
              <Link href="/dashboard/valuation">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Valuation Workspace</h3>
                  <p className="text-sm text-muted-foreground">
                    DCF models, comps analysis, and automated memo generation
                  </p>
                </div>
              </Link>
              <Link href="/dashboard/search">
                <div className="p-6 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <Search className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Semantic Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Search across all documents with AI-powered understanding
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
