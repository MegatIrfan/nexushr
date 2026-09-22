import type { Metadata } from "next";

import { PerformanceView } from "./_components/performance-view";

export const metadata: Metadata = {
  title: "Performance & OKRs | NexusHR",
  description: "Company-wide objective tracking, quarterly appraisal cycles, and employee performance management.",
};

export default function PerformancePage() {
  return <PerformanceView />;
}
