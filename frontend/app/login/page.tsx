"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Store, ArrowRight, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"buyer" | "seller" | "pe" | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select your user type");
      return;
    }

    // Mock login - in production, this would call an API
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', userType);
      localStorage.setItem('isLoggedIn', 'true');
    }

    // Redirect to appropriate dashboard
    if (userType === "buyer") {
      router.push('/dashboard/buyer');
    } else if (userType === "seller") {
      router.push('/dashboard/seller');
    } else if (userType === "pe") {
      router.push('/dashboard');
    }
  };

  const handleDemoAccess = (type: "buyer" | "seller" | "pe") => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', type);
      localStorage.setItem('isLoggedIn', 'true');
    }

    if (type === "buyer") {
      router.push('/dashboard/buyer');
    } else if (type === "seller") {
      router.push('/dashboard/seller');
    } else if (type === "pe") {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">Welcome to AcquiSmart</CardTitle>
          <CardDescription>Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Role</Label>
              <RadioGroup value={userType} onValueChange={(value) => setUserType(value as "buyer" | "seller" | "pe")}>
                <div className="flex items-center space-x-3 border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors">
                  <RadioGroupItem value="buyer" id="buyer" />
                  <Label htmlFor="buyer" className="flex-1 cursor-pointer flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="font-medium">Buyer</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors">
                  <RadioGroupItem value="seller" id="seller" />
                  <Label htmlFor="seller" className="flex-1 cursor-pointer flex items-center gap-2">
                    <Store className="h-4 w-4 text-primary" />
                    <span className="font-medium">Seller</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors">
                  <RadioGroupItem value="pe" id="pe" />
                  <Label htmlFor="pe" className="flex-1 cursor-pointer flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-medium">PE Firm</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full" size="lg" disabled={!userType}>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* First Time User */}
            <Link href="/marketplace/expert-mode">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                First Time User - Get Started
              </Button>
            </Link>

            {/* Links */}
            <div className="text-center pt-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
