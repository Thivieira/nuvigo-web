'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCTAButton() {
  const { isAuthenticated } = useAuth();

  return (
    <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
      <Button size="lg" className="gap-2 cursor-pointer">
        {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
} 