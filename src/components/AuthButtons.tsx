'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthButtons() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex items-center gap-4 whitespace-nowrap">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
          <Link href="/dashboard">
            <Button className="cursor-pointer">Dashboard</Button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="ghost" className="cursor-pointer">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="cursor-pointer">Sign Up</Button>
          </Link>
        </>
      )}
    </div>
  );
} 