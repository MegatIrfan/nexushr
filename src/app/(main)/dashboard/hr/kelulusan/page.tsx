import type { Metadata } from "next";

import { HrGuard } from "../_components/hr-guard";
import { KelulusanView } from "../_components/kelulusan-view";

export const metadata: Metadata = {
  title: "Approval Requests | NexusHR",
  description: "Review and take action on employee leave requests and approvals.",
};

export default function KelulusanPage() {
  return (
    <HrGuard>
      <KelulusanView />
    </HrGuard>
  );
}
