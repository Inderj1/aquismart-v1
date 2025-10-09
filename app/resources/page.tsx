import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Video, Award, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResourcesPage() {
  const articles = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
      category: "Guide",
      title: "Complete Guide to Business Acquisition Due Diligence",
      description: "Everything you need to know about conducting thorough due diligence when acquiring a business, from financial analysis to legal considerations.",
      readTime: "12 min read",
      date: "Mar 15, 2025",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80",
      category: "Case Study",
      title: "How a First-Time Buyer Acquired a $5M SaaS Business",
      description: "Learn how David Park used AcquiSmart's platform to identify, evaluate, and successfully acquire his first business in just 60 days.",
      readTime: "8 min read",
      date: "Mar 12, 2025",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      category: "Analysis",
      title: "2025 Business Acquisition Market Trends",
      description: "Industry insights on valuation multiples, buyer demand, and emerging opportunities across different business sectors.",
      readTime: "10 min read",
      date: "Mar 10, 2025",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
      category: "Guide",
      title: "Understanding Business Valuation Metrics",
      description: "A comprehensive breakdown of EBITDA multiples, SDE, and other key metrics used to value businesses in different industries.",
      readTime: "15 min read",
      date: "Mar 8, 2025",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
      category: "Best Practices",
      title: "Negotiating Your First Business Acquisition",
      description: "Expert tips on structuring offers, negotiating terms, and closing deals while protecting your interests as a buyer.",
      readTime: "9 min read",
      date: "Mar 5, 2025",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=600&q=80",
      category: "Case Study",
      title: "Serial Acquirer Builds $20M Portfolio in 18 Months",
      description: "How Monica Kurt leveraged AI-powered matching to identify and acquire multiple businesses across different industries.",
      readTime: "11 min read",
      date: "Mar 1, 2025",
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
      category: "Guide",
      title: "Financing Options for Business Acquisitions",
      description: "Explore SBA loans, seller financing, private equity, and other funding strategies for acquiring businesses.",
      readTime: "13 min read",
      date: "Feb 28, 2025",
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=600&q=80",
      category: "Analysis",
      title: "E-commerce Business Acquisition Playbook",
      description: "Industry-specific insights for evaluating and acquiring e-commerce businesses, including inventory and supplier considerations.",
      readTime: "14 min read",
      date: "Feb 25, 2025",
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
      category: "Best Practices",
      title: "Post-Acquisition Integration: The First 90 Days",
      description: "A proven framework for successfully integrating a newly acquired business while maintaining operations and employee morale.",
      readTime: "10 min read",
      date: "Feb 22, 2025",
    },
  ];

  const resourceTypes = [
    {
      icon: BookOpen,
      title: "Guides & Tutorials",
      description: "Step-by-step guides covering every aspect of business acquisition",
      count: "24 guides",
    },
    {
      icon: FileText,
      title: "Case Studies",
      description: "Real-world success stories from buyers who found their perfect match",
      count: "15 studies",
    },
    {
      icon: Video,
      title: "Webinars & Videos",
      description: "Expert insights and educational content from industry professionals",
      count: "18 videos",
    },
    {
      icon: Award,
      title: "Industry Reports",
      description: "Market analysis and trends across different business sectors",
      count: "12 reports",
    },
  ];

  return (
    <main>
      <LpNavbar1 />

      {/* Hero Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Tagline>Resources</Tagline>
            <h1 className="heading-xl">
              Your Knowledge Hub for Business Acquisition
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Learn from expert guides, real-world case studies, and industry insights to make informed acquisition decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Types */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceTypes.map((type) => (
              <Card
                key={type.title}
                className="bg-muted/80 border-none shadow-none hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
                  <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center">
                    <type.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-foreground font-semibold text-lg">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {type.description}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {type.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-secondary section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Latest Articles & Insights
              </h2>
              <p className="text-muted-foreground">
                Expert content to guide your acquisition journey
              </p>
            </div>
            <Button variant="outline">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/95 text-foreground hover:bg-background/95">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/5">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Insights Stats */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Market Insights</Tagline>
            <h2 className="heading-lg">
              Data-Driven Business Acquisition Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3 p-6 bg-muted/50 rounded-xl">
              <div className="text-4xl font-bold text-primary">150+</div>
              <div className="text-foreground font-semibold">Educational Resources</div>
              <p className="text-sm text-muted-foreground">
                Comprehensive guides, case studies, and industry reports
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 p-6 bg-muted/50 rounded-xl">
              <div className="text-4xl font-bold text-primary">50K+</div>
              <div className="text-foreground font-semibold">Monthly Readers</div>
              <p className="text-sm text-muted-foreground">
                Business buyers learning from our expert content
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 p-6 bg-muted/50 rounded-xl">
              <div className="text-4xl font-bold text-primary">25+</div>
              <div className="text-foreground font-semibold">Industry Experts</div>
              <p className="text-sm text-muted-foreground">
                Contributing advisors and successful acquirers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <h2 className="heading-lg">
              Stay Updated with the Latest Insights
            </h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter and receive weekly articles, market trends, and exclusive acquisition opportunities.
            </p>
            <div className="w-full max-w-md">
              <div className="bg-background rounded-lg p-2 flex gap-2 shadow-sm border">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-transparent border-none outline-none text-sm px-3"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Join 10,000+ business buyers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <h2 className="heading-lg max-w-2xl">
              Ready to Put Your Knowledge Into Action?
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Start browsing verified business listings and find your perfect acquisition match today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/marketplace">
                <Button size="lg">Explore Marketplace</Button>
              </Link>
              <Link href="/platform">
                <Button size="lg" variant="outline">Learn About Platform</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </main>
  );
}
