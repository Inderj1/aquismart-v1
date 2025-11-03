"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Sparkles, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const sampleResults = [
    {
      title: "TechCo Q3 2024 Revenue",
      snippet: "Revenue for Q3 2024 was $12.5M, representing a 23% YoY growth...",
      source: "Q3 2024 Quarterly Financials - TechCo",
      page: 3,
      confidence: 0.96,
      type: "KPI",
      date: "2024-09-30"
    },
    {
      title: "Fund VII Capital Account - ABC Partners",
      snippet: "Committed capital: $50M, Drawn capital: $32M, Unfunded commitment: $18M...",
      source: "Capital Account Statement - Fund VII",
      page: 1,
      confidence: 0.94,
      type: "Document",
      date: "2024-09-30"
    },
    {
      title: "Covenant Breach - XYZ Corp Debt",
      snippet: "Leverage ratio of 4.2x exceeds maximum covenant of 4.0x as of Q3 2024...",
      source: "Covenant Calculations - XYZ Corp",
      page: 2,
      confidence: 0.91,
      type: "Alert",
      date: "2024-10-15"
    }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResults(sampleResults);
    setSearching(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "KPI": return "bg-blue-100 text-blue-700";
      case "Document": return "bg-green-100 text-green-700";
      case "Alert": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">AI-Powered Search</h1>
          <p className="text-muted-foreground mt-1">Semantic search across all documents and entities</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for companies, KPIs, documents, or ask a question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={searching || !query.trim()}
                  className="h-12 px-8"
                >
                  {searching ? "Searching..." : "AI Search"}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Try:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("What was TechCo's revenue growth in Q3 2024?");
                    setTimeout(handleSearch, 100);
                  }}
                >
                  Revenue growth Q3
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("Show all covenant breaches");
                    setTimeout(handleSearch, 100);
                  }}
                >
                  Covenant breaches
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <Sparkles className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Semantic Understanding</h3>
                <p className="text-sm text-muted-foreground">
                  Sentence-BERT embeddings understand context
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Source Lineage</h3>
                <p className="text-sm text-muted-foreground">
                  Click through to exact document pages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Filter className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Smart Filtering</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered relevance ranking
                </p>
              </CardContent>
            </Card>
          </div>

          {results.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {results.length} Results
              </h2>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{result.title}</h3>
                            <Badge className={getTypeColor(result.type)}>
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {result.snippet}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {result.source}
                            </div>
                            <span>Page {result.page}</span>
                            <span>{result.date}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium mb-1">
                            {Math.round(result.confidence * 100)}% match
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Source
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
