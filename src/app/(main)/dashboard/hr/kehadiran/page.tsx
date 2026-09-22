import type { Metadata } from "next";

import { HrGuard } from "../_components/hr-guard";
import { KehadiranView } from "../_components/kehadiran-view";

export const metadata: Metadata = {
  title: "Time & Attendance | NexusHR",
  description: "Track employee attendance, punctuality, and clock records.",
};

export default function KehadiranPage() {
  return (
    <HrGuard>
      <KehadiranView />
    </HrGuard>
  );
}
