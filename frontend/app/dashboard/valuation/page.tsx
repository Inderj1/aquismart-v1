"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, FileText, Sparkles, Calculator, Building2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ValuationPage() {
  const [method, setMethod] = useState("dcf");
  const [generating, setGenerating] = useState(false);

  const companies = [
    { id: "techco", name: "TechCo Inc" },
    { id: "mediaco", name: "MediaCo Ltd" },
    { id: "retailco", name: "RetailCo Group" }
  ];

  const handleGenerateMemo = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">Valuation Workspace</h1>
          <p className="text-muted-foreground mt-1">AI-powered DCF and valuation analysis</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Selection</CardTitle>
                <CardDescription>Select portfolio company for valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Portfolio Company</Label>
                    <Select defaultValue="techco">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(co => (
                          <SelectItem key={co.id} value={co.id}>{co.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Valuation Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dcf">Income DCF</SelectItem>
                        <SelectItem value="comps">Market Comps</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Inputs</CardTitle>
                <CardDescription>Key assumptions for valuation model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Revenue (LTM)</Label>
                    <Input type="number" placeholder="100" defaultValue="125" />
                  </div>
                  <div>
                    <Label>EBITDA Margin %</Label>
                    <Input type="number" placeholder="25" defaultValue="28" />
                  </div>
                  <div>
                    <Label>Revenue Growth %</Label>
                    <Input type="number" placeholder="15" defaultValue="18" />
                  </div>
                  <div>
                    <Label>WACC %</Label>
                    <Input type="number" placeholder="12" defaultValue="10.5" />
                  </div>
                  <div>
                    <Label>Terminal Growth %</Label>
                    <Input type="number" placeholder="3" defaultValue="2.5" />
                  </div>
                  <div>
                    <Label>Net Debt</Label>
                    <Input type="number" placeholder="50" defaultValue="45" />
                  </div>
                </div>
                <Button className="w-full mt-6">
                  <Calculator className="mr-2 h-4 w-4" />
                  Run Valuation Model
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Valuation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Fair Value Estimate</p>
                    <p className="text-4xl font-bold text-primary">$525M</p>
                    <p className="text-sm text-muted-foreground mt-2">95% confidence</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-accent rounded">
                      <span className="text-sm">Enterprise Value</span>
                      <span className="font-semibold">$570M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent rounded">
                      <span className="text-sm">Net Debt</span>
                      <span className="font-semibold">-$45M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/20 rounded">
                      <span className="text-sm font-medium">Equity Value</span>
                      <span className="font-bold">$525M</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Driver Attribution</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Revenue Growth</span>
                        <span className="text-green-600">+$42M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EBITDA Margin</span>
                        <span className="text-green-600">+$28M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WACC</span>
                        <span className="text-red-600">-$15M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Memo Generation</CardTitle>
                <CardDescription>GPT-4 powered investment memo</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={handleGenerateMemo}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate IC Memo
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Includes executive summary, analysis, and citations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
