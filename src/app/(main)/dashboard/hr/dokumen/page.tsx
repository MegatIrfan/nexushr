import type { Metadata } from "next";

import { DokumenView } from "../_components/dokumen-view";
import { HrGuard } from "../_components/hr-guard";

export const metadata: Metadata = {
  title: "HR Documents | NexusHR",
  description: "Manage, review, and access organizational HR documents.",
};

export default function DokumenPage() {
  return (
    <HrGuard>
      <DokumenView />
    </HrGuard>
  );
}
