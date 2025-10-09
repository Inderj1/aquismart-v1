import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AcquiSmart - AI-Powered Business Marketplace",
  description:
    "Discover verified businesses with AI-powered matching, comprehensive fraud protection, and secure transaction workflows.",
  icons: {
    icon: '/image.png',
    apple: '/image.png',
  },
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${onest.variable} relative antialiased`}>
          {children}
        </body>
      </html>
    </>
  );
}
