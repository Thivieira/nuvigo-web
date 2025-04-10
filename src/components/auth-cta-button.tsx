'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function AuthCTAButton() {
  const { isAuthenticated } = useAuth();

  return (
    <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
      <Button size="lg" className="gap-2 cursor-pointer">
        {isAuthenticated ? "Ir para o Painel" : "Começar"} <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
} 