import type { Metadata } from "next";

import { HrGuard } from "../_components/hr-guard";
import { KakitanganView } from "../_components/kakitangan-view";

export const metadata: Metadata = {
  title: "Employee Directory | NexusHR",
  description: "Manage employee profiles, designations, and departmental records.",
};

export default function KakitanganPage() {
  return (
    <HrGuard>
      <KakitanganView />
    </HrGuard>
  );
}
