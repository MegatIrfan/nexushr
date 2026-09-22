import type { Metadata } from "next";

import { RecruitmentView } from "./_components/recruitment-view";

export const metadata: Metadata = {
  title: "Recruitment & ATS | NexusHR",
  description: "Applicant tracking system, candidate pipeline stages, and global job requisitions.",
};

export default function RecruitmentPage() {
  return <RecruitmentView />;
}
