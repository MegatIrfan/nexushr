import {
  Briefcase,
  Calendar,
  CalendarCheck,
  ClipboardCheck,
  FileStack,
  type LucideIcon,
  Target,
  UserCog,
  Users,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 0,
    label: "Workforce Management",
    items: [
      {
        id: "hr-dashboard",
        title: "Executive Overview",
        url: "/dashboard/hr",
        icon: UserCog,
      },
      {
        id: "hr-kakitangan",
        title: "Employee Directory",
        url: "/dashboard/hr/kakitangan",
        icon: Users,
      },
      {
        id: "hr-kehadiran",
        title: "Time & Attendance",
        url: "/dashboard/hr/kehadiran",
        icon: CalendarCheck,
      },
      {
        id: "hr-cuti",
        title: "Leave Management",
        url: "/dashboard/hr/cuti",
        icon: Calendar,
      },
      {
        id: "hr-recruitment",
        title: "Recruitment & ATS",
        url: "/dashboard/hr/recruitment",
        icon: Briefcase,
      },
      {
        id: "hr-performance",
        title: "Performance & OKRs",
        url: "/dashboard/hr/performance",
        icon: Target,
      },
      {
        id: "hr-kelulusan",
        title: "Approval Requests",
        url: "/dashboard/hr/kelulusan",
        icon: ClipboardCheck,
      },
      {
        id: "hr-dokumen",
        title: "HR Documents",
        url: "/dashboard/hr/dokumen",
        icon: FileStack,
      },
    ],
  },
];

export function getSidebarItemsForRole(role?: string): NavGroup[] {
  if (role === "ketua") {
    return [
      {
        id: 0,
        label: "Team Lead Portal",
        items: [
          {
            id: "hr-dashboard",
            title: "Team Overview",
            url: "/dashboard/hr",
            icon: UserCog,
          },
          {
            id: "hr-kelulusan",
            title: "Leave Approvals",
            url: "/dashboard/hr/kelulusan",
            icon: ClipboardCheck,
          },
          {
            id: "hr-kehadiran",
            title: "Team Attendance",
            url: "/dashboard/hr/kehadiran",
            icon: CalendarCheck,
          },
          {
            id: "hr-kakitangan",
            title: "Direct Reports",
            url: "/dashboard/hr/kakitangan",
            icon: Users,
          },
          {
            id: "hr-performance",
            title: "Team Appraisals",
            url: "/dashboard/hr/performance",
            icon: Target,
          },
          {
            id: "hr-cuti",
            title: "My Time Off",
            url: "/dashboard/hr/cuti",
            icon: Calendar,
          },
        ],
      },
    ];
  }

  if (role === "staf") {
    return [
      {
        id: 0,
        label: "Employee Self-Service",
        items: [
          {
            id: "hr-dashboard",
            title: "My Workspace",
            url: "/dashboard/hr",
            icon: UserCog,
          },
          {
            id: "hr-kehadiran",
            title: "Time Clock & Records",
            url: "/dashboard/hr/kehadiran",
            icon: CalendarCheck,
          },
          {
            id: "hr-cuti",
            title: "Leave & Balances",
            url: "/dashboard/hr/cuti",
            icon: Calendar,
          },
          {
            id: "hr-performance",
            title: "My Goals & Reviews",
            url: "/dashboard/hr/performance",
            icon: Target,
          },
          {
            id: "hr-dokumen",
            title: "My Documents",
            url: "/dashboard/hr/dokumen",
            icon: FileStack,
          },
        ],
      },
    ];
  }

  return sidebarItems;
}
