"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface NavMenuItemsProps {
  className?: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const NavMenuItems = ({ className, isLoggedIn, onLogout }: NavMenuItemsProps) => (
  <div className={`flex flex-col gap-1 md:flex-row ${className ?? ""}`}>
    <Link href="/about">
      <Button variant="ghost" className="w-full md:w-auto">
        About
      </Button>
    </Link>
    {isLoggedIn ? (
      <Button
        variant="ghost"
        className="w-full md:w-auto"
        onClick={onLogout}
      >
        Logout
      </Button>
    ) : (
      <Link href="/login">
        <Button variant="ghost" className="w-full md:w-auto">
          Login
        </Button>
      </Link>
    )}
  </div>
);

export function LpNavbar1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user has a profile (logged in)
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('welcomeProfile') || localStorage.getItem('buyerProfile');
      setIsLoggedIn(!!profile);
    }
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('welcomeProfile');
      localStorage.removeItem('buyerProfile');
      localStorage.removeItem('expertModeProfile');
      setIsLoggedIn(false);
      setIsMenuOpen(false);
      router.push('/');
    }
  };

  return (
    <nav className="bg-background sticky top-0 isolate z-50 border-b py-2.5 md:py-3 pointer-events-auto">
      <div className="relative container m-auto flex flex-col justify-between gap-3 px-6 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center cursor-pointer">
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
          <NavMenuItems isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          {!isLoggedIn && (
            <Link href="/early-access">
              <Button>Join for Early Access</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="flex w-full flex-col justify-end gap-5 pb-2.5 md:hidden">
            <NavMenuItems isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            {!isLoggedIn && (
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
