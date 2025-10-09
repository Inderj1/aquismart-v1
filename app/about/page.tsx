import { LpNavbar1 } from "@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1";
import { Footer1 } from "@/components/pro-blocks/landing-page/footers/footer-1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import { Target, Heart, Users, Lightbulb, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Buyer-First Approach",
      description: "Every feature we build prioritizes the needs of business buyers, making acquisition accessible and transparent.",
    },
    {
      icon: Target,
      title: "Trust & Verification",
      description: "We're committed to creating a marketplace where every listing is verified and every transaction is secure.",
    },
    {
      icon: Lightbulb,
      title: "Innovation in AI",
      description: "We leverage cutting-edge machine learning to make business matching smarter and more accurate than ever.",
    },
    {
      icon: Users,
      title: "Community Success",
      description: "Your success is our success. We measure our impact by the successful acquisitions our buyers complete.",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Co-Founder & CEO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      bio: "Former M&A advisor with 12 years experience in business acquisitions",
    },
    {
      name: "Michael Rodriguez",
      role: "Co-Founder & CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      bio: "ML engineer previously at top tech companies, specializing in matching algorithms",
    },
    {
      name: "Emily Thompson",
      role: "Head of Verification",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      bio: "Fraud detection expert with background in financial compliance",
    },
    {
      name: "David Kim",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
      bio: "Product leader focused on building intuitive tools for complex processes",
    },
  ];

  const milestones = [
    {
      year: "2024 Q1",
      title: "Founded AcquiSmart",
      description: "Started with a vision to democratize business acquisition through AI",
    },
    {
      year: "2024 Q2",
      title: "Beta Launch",
      description: "Onboarded first 50 verified businesses and 200 qualified buyers",
    },
    {
      year: "2024 Q3",
      title: "First Successful Matches",
      description: "Facilitated 3 successful business acquisitions totaling $12M",
    },
    {
      year: "2025 Q1",
      title: "Platform Expansion",
      description: "Launched advanced ML features and expanded to 500+ listings",
    },
  ];

  return (
    <main>
      <LpNavbar1 />

      {/* Hero Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 lg:gap-8">
            <div className="section-title-gap-xl flex flex-col">
              <Tagline>About Us</Tagline>
              <h1 className="heading-xl">
                Making Business Acquisition Accessible to Everyone
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                We're on a mission to transform the business acquisition landscape with AI-powered matching, comprehensive verification, and a buyer-first approach.
              </p>
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                fill
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto max-w-4xl">
          <div className="flex flex-col gap-6 text-center">
            <Tagline>Our Story</Tagline>
            <h2 className="heading-lg">
              Why AcquiSmart Exists
            </h2>
            <div className="flex flex-col gap-4 text-muted-foreground text-base leading-relaxed">
              <p>
                After years of working in M&A and watching countless qualified buyers struggle to find the right businesses, we knew there had to be a better way. Traditional business brokers charge hefty fees, listings are scattered across dozens of platforms, and fraud is a constant concern.
              </p>
              <p>
                We founded AcquiSmart in 2024 to solve these problems. By combining advanced AI matching technology with ML-powered fraud detection, we created the first truly modern business acquisition marketplace. Our platform makes it possible for first-time buyers and seasoned acquirers alike to find verified, high-quality business opportunities.
              </p>
              <p>
                Today, we're proud to serve hundreds of buyers and sellers, facilitating millions in successful transactions. But we're just getting started—our vision is to become the trusted platform for every business acquisition worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-secondary section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Our Values</Tagline>
            <h2 className="heading-lg">
              What Drives Us Every Day
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="bg-background border-none shadow-none">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-foreground text-xl font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Our Team</Tagline>
            <h2 className="heading-lg">
              Meet the People Behind AcquiSmart
            </h2>
            <p className="text-muted-foreground">
              We're a passionate team of technologists, M&A experts, and entrepreneurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="bg-muted/80 border-none shadow-none overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-5 flex flex-col gap-2">
                  <h3 className="text-foreground font-semibold text-lg">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-secondary section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center mb-10 md:mb-12">
            <Tagline>Journey</Tagline>
            <h2 className="heading-lg">
              Our Journey So Far
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 md:left-1/2" />

              {/* Milestones */}
              <div className="flex flex-col gap-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative flex flex-col md:flex-row gap-4 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Circle indicator */}
                    <div className="absolute left-8 w-4 h-4 bg-primary rounded-full border-4 border-secondary md:left-1/2 md:-translate-x-1/2" />

                    {/* Content */}
                    <div className={`flex-1 pl-16 md:pl-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="bg-background p-6 rounded-xl shadow-sm">
                        <div className="text-primary font-bold text-sm mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-foreground font-semibold text-lg mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <Tagline>Careers</Tagline>
              <h2 className="text-3xl font-bold text-foreground mb-3 mt-4">
                Join Our Growing Team
              </h2>
              <p className="text-muted-foreground mb-6">
                We're always looking for talented individuals who are passionate about transforming the business acquisition industry. If you're excited about AI, marketplaces, and helping entrepreneurs succeed, we'd love to hear from you.
              </p>
              <Button>View Open Positions</Button>
            </div>
            <div className="w-full md:w-96 flex-shrink-0">
              <div className="relative aspect-square w-full">
                <Image
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80"
                  alt="Team working together"
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-secondary section-padding-y">
        <div className="container-padding-x container mx-auto">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="heading-lg mb-4">
                Get in Touch
              </h2>
              <p className="text-muted-foreground">
                Have questions about AcquiSmart? Want to learn more about our platform or partnership opportunities? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="bg-background border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-foreground font-semibold">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    hello@acquismart.com
                  </p>
                  <Link href="mailto:hello@acquismart.com">
                    <Button variant="outline" size="sm">
                      Send Email
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-foreground font-semibold">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">
                    San Francisco, CA<br />United States
                  </p>
                  <Button variant="outline" size="sm">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </main>
  );
}
