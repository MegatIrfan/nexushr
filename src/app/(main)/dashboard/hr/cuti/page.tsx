import type { Metadata } from "next";

import { CutiView } from "../_components/cuti-view";
import { HrGuard } from "../_components/hr-guard";

export const metadata: Metadata = {
  title: "Leave Management | NexusHR",
  description: "Apply for leave, track balances, and manage time-off requests.",
};

export default function CutiPage() {
  return (
    <HrGuard>
      <CutiView />
    </HrGuard>
  );
}
