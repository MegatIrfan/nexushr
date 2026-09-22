interface PersonReference {
  name: string;
  role: string;
  initials: string;
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: "Signed" | "Current";
  isRestricted: boolean;
}

export interface ProfileRecord {
  name: string;
  preferredName: string;
  legalName: string;
  pronouns: string;
  initials: string;
  avatar: string;
  engagementStatus: "Active";
  jobTitle: string;
  jobLevel: string;
  department: string;
  team: string;
  currentProject: string;
  workEmail: string;
  personalEmail: string;
  workPhone: string;
  workplace: string;
  timeZone: string;
  contractorId: string;
  startDate: string;
  engagementLength: string;
  employmentType: string;
  weeklyHours: string;
  schedule: string;
  contractingEntity: string;
  noticePeriod: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  manager: PersonReference;
  bio: string;
  leavePolicy: string;
  annualLeaveAllowance: string;
  remainingLeave: string;
  carriedOverLeave: string;
  usedLeave: string;
  scheduledLeave: string;
  pendingLeaveRequests: string;
  leaveYear: string;
  nextLeave: string;
  lastWorkingDay: string;
  updatedBy: string;
  updatedAt: string;
  documents: ProfileDocument[];
}

export const profile: ProfileRecord = {
  name: "Ahmad Farhan bin Zulkifli",
  preferredName: "Farhan",
  legalName: "Ahmad Farhan bin Zulkifli",
  pronouns: "He / him",
  initials: "AF",
  avatar: "",
  engagementStatus: "Active",
  jobTitle: "Head of People & Culture",
  jobLevel: "Executive",
  department: "People Operations",
  team: "Executive Leadership",
  currentProject: "NexusHR Workforce Cloud Scale",
  workEmail: "admin@company.com",
  personalEmail: "ahmad.farhan@gmail.com",
  workPhone: "+60 12-345 6789",
  workplace: "Kuala Lumpur (HQ)",
  timeZone: "UTC+8:00",
  contractorId: "NX-0101",
  startDate: "March 1, 2018",
  engagementLength: "8 years, 6 months",
  employmentType: "Full-Time Executive",
  weeklyHours: "40 hours",
  schedule: "Monday–Friday · 9:00 AM–5:30 PM",
  contractingEntity: "NexusHR Global Technologies Sdn. Bhd.",
  noticePeriod: "60 days",
  dateOfBirth: "April 14, 1988",
  address: "Menara Nexus, Level 32, Jalan Tun Razak, 50400 Kuala Lumpur",
  emergencyContact: "Siti Zubaidah · Spouse",
  emergencyPhone: "+60 12-987 6543",
  manager: {
    name: "Nurul Izzah binti Hashim",
    role: "Chief Executive Officer",
    initials: "NI",
  },
  bio: "Ahmad Farhan leads people operations, corporate talent acquisition, employee experience, and HR policy frameworks at NexusHR. He focuses on scaling enterprise workforce culture and driving automated HR digital transformations.",
  leavePolicy: "Executive unlimited PTO policy",
  annualLeaveAllowance: "30 days",
  remainingLeave: "24 days",
  carriedOverLeave: "5 days",
  usedLeave: "6 days",
  scheduledLeave: "3 days",
  pendingLeaveRequests: "0",
  leaveYear: "January 1–December 31, 2026",
  nextLeave: "October 12–16, 2026",
  lastWorkingDay: "N/A",
  updatedBy: "Ahmad Farhan",
  updatedAt: "September 20, 2026",
  documents: [
    {
      id: "doc-1",
      name: "Contractor agreement",
      category: "Contract",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: false,
    },
    {
      id: "doc-2",
      name: "Confidentiality agreement",
      category: "Compliance",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: true,
    },
    {
      id: "doc-4",
      name: "Information security policy acknowledgement",
      category: "Policy",
      updatedAt: "Jan 8, 2026",
      status: "Current",
      isRestricted: false,
    },
  ],
};
