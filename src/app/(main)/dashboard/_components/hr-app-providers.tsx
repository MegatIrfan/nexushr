"use client";

import type { ReactNode } from "react";

import { HrAuthProvider } from "@/stores/hr/auth-store";
import { HrProvider } from "@/stores/hr/hr-store";

export function HrAppProviders({ children }: { children: ReactNode }) {
  return (
    <HrAuthProvider>
      <HrProvider>{children}</HrProvider>
    </HrAuthProvider>
  );
}
