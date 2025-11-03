"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const MENU_ITEMS = [
  { label: "Businesses", href: "/marketplace" },
  { label: "About", href: "/about" },
  { label: "Login", href: "/login" },
] as const;

interface NavMenuItemsProps {
  className?: string;
}

const NavMenuItems = ({ className }: NavMenuItemsProps) => (
  <div className={`flex flex-col gap-1 md:flex-row ${className ?? ""}`}>
    {MENU_ITEMS.map(({ label, href }) => (
      <Link key={label} href={href}>
        <Button variant="ghost" className="w-full md:w-auto">
          {label}
        </Button>
      </Link>
    ))}
  </div>
);

export function LpNavbar1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnDashboard, setIsOnDashboard] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in by checking if they're on a dashboard route
    const onDashboard = pathname?.startsWith("/dashboard") || false;
    setIsLoggedIn(onDashboard);
    setIsOnDashboard(onDashboard);
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="bg-background sticky top-0 isolate z-50 border-b py-2.5 md:py-3">
      <div className="relative container m-auto flex flex-col justify-between gap-3 px-6 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">
              <span className="text-blue-600">ACQUI</span>
              <span className="text-orange-600">SMART</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            className="flex size-9 items-center justify-center md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden w-full flex-row justify-end gap-5 md:flex">
          {!isLoggedIn && <NavMenuItems />}
          {isLoggedIn ? (
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
          ) : (
            <Link href="/early-access">
              <Button>Join for Early Access</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="flex w-full flex-col justify-end gap-5 pb-2.5 md:hidden">
            {!isLoggedIn && <NavMenuItems />}
            {isLoggedIn ? (
              <Link href="/">
                <Button variant="ghost" className="w-full">Home</Button>
              </Link>
            ) : (
              <Link href="/early-access">
                <Button className="w-full">Join for Early Access</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
