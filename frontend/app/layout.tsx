import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext";
import { OrganizationStructuredData, WebsiteStructuredData, LocalBusinessStructuredData } from "@/components/seo/StructuredData";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://acquismart.com'),
  title: {
    default: "AcquiSmart - Buy & Sell Businesses | AI-Powered Business Marketplace",
    template: "%s | AcquiSmart"
  },
  description:
    "Buy or sell businesses with confidence. AcquiSmart uses AI to match buyers and sellers, provide accurate valuations, and streamline M&A transactions. Browse thousands of businesses for sale.",
  keywords: [
    "buy business",
    "sell business",
    "business for sale",
    "acquire business",
    "business acquisition",
    "business marketplace",
    "M&A platform",
    "business valuation",
    "private equity",
    "business broker",
    "small business for sale",
    "buy small business",
    "business acquisition platform",
    "mergers and acquisitions",
    "business sale marketplace",
    "AI business matching",
    "business investment",
    "entrepreneurship",
    "business opportunities"
  ],
  authors: [{ name: "AcquiSmart" }],
  creator: "AcquiSmart",
  publisher: "AcquiSmart",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/image.png',
    apple: '/image.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://acquismart.com',
    title: 'AcquiSmart - Buy & Sell Businesses | AI-Powered Business Marketplace',
    description: 'Buy or sell businesses with confidence. AI-powered matching, valuations, and streamlined M&A transactions. Browse thousands of businesses for sale.',
    siteName: 'AcquiSmart',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AcquiSmart - Business Marketplace Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AcquiSmart - Buy & Sell Businesses | AI-Powered Business Marketplace',
    description: 'Buy or sell businesses with confidence. AI-powered matching, valuations, and streamlined M&A transactions.',
    images: ['/og-image.png'],
    creator: '@acquismart',
  },
  alternates: {
    canonical: 'https://acquismart.com',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <link rel="canonical" href="https://acquismart.com" />
        </head>
        <body className={`${onest.variable} relative antialiased`}>
          <OrganizationStructuredData />
          <WebsiteStructuredData />
          <LocalBusinessStructuredData />
          <AppProvider>
            {children}
          </AppProvider>
        </body>
      </html>
    </>
  );
}
