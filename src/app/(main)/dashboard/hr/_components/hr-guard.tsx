"use client";

import { type ReactNode, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useHrAuth } from "@/stores/hr/auth-store";

export function HrGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useHrAuth((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/hr/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
