import type { ReactNode } from "react";

import { HrAuthProvider } from "@/stores/hr/auth-store";
import { HrProvider } from "@/stores/hr/hr-store";

// This layout wraps the HR login page — no sidebar, just providers
export default function HrAuthLayout({ children }: { children: ReactNode }) {
  return (
    <HrAuthProvider>
      <HrProvider>{children}</HrProvider>
    </HrAuthProvider>
  );
}
