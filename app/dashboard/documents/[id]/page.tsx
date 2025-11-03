"use client";

import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle2, ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context/AppContext";
import { Badge } from "@/components/ui/badge";

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { getDocument, getCompany } = useApp();
  const document = getDocument(resolvedParams.id);

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Document Not Found</h1>
          <p className="text-muted-foreground mb-6">The document you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const company = document.companyId ? getCompany(document.companyId) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-3xl font-bold">{document.name}</h1>
              <p className="text-muted-foreground mt-1">Uploaded {document.uploadedAt.toLocaleString()}</p>
            </div>
            <Badge className="bg-green-100 text-green-700">
              {document.confidence}% Confidence
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Document Type</p>
                    <p className="font-semibold">{document.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-green-100 text-green-700">{document.status}</Badge>
                  </div>
                  {company && (
                    <div>
                      <p className="text-sm text-muted-foreground">Linked Company</p>
                      <p className="font-semibold">{company.name}</p>
                    </div>
                  )}
                  {company && (
                    <div>
                      <p className="text-sm text-muted-foreground">Sector</p>
                      <p className="font-semibold">{company.sector}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Fields</CardTitle>
                <CardDescription>AI-extracted data with source lineage</CardDescription>
              </CardHeader>
              <CardContent>
                {document.extractedFields && document.extractedFields.length > 0 ? (
                  <div className="space-y-3">
                    {document.extractedFields.map((field, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold">{field.key}</p>
                            <p className="text-2xl font-bold text-primary mt-1">{field.value}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{field.confidence}%</p>
                            <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden mt-1">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${field.confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Page {field.page}</span>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Source
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No extracted fields available</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company && (
                  <Button 
                    className="w-full justify-start"
                    onClick={() => router.push(`/dashboard/valuation?company=${company.id}`)}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Run Valuation for {company.name}
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  View Original Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve Extraction
                </Button>
              </CardContent>
            </Card>

            {company && (
              <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue (LTM)</p>
                    <p className="text-xl font-bold">${company.revenue}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">EBITDA (LTM)</p>
                    <p className="text-xl font-bold">${company.ebitda}M</p>
                  </div>
                  {company.lastValuation && (
                    <div>
                      <p className="text-sm text-muted-foreground">Last Valuation</p>
                      <p className="text-xl font-bold">${company.lastValuation}M</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {company.lastValuationDate?.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
