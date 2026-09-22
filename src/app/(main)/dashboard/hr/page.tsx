import type { Metadata } from "next";

import { HrDashboard } from "./_components/hr-dashboard";
import { HrGuard } from "./_components/hr-guard";

export const metadata: Metadata = {
  title: "Executive Overview | NexusHR",
  description: "Enterprise Workforce and People Operations Management Dashboard.",
};

export default function HrPage() {
  return (
    <HrGuard>
      <HrDashboard />
    </HrGuard>
  );
}
