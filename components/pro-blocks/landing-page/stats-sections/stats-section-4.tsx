"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

export function StatsSection4() {
  return (
    <section className="bg-background section-padding-y border-b">
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
            <Tagline>Metrics</Tagline>
            <h2 className="heading-lg text-foreground">Early Traction & Growing Fast</h2>
            <p className="text-muted-foreground">
              Join our growing community of verified buyers and sellers
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 lg:flex-row">
            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">
                  Verified businesses
                </h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  25+
                </span>

                <p className="text-muted-foreground text-base">
                  Currently on platform
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">Successful matches</h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  3
                </span>
                <p className="text-muted-foreground text-base">
                  This quarter
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">Average response time</h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  48hrs
                </span>
                <p className="text-muted-foreground text-base">
                  From verified sellers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
