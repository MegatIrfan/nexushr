"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "cn";
import {
  Award,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileSpreadsheet,
  LogOut,
  Megaphone,
  PartyPopper,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { announcementsData } from "@/data/hr-data";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

import { PenyeliaDashboard } from "./penyelia-dashboard";
import { RoleSwitcherBanner } from "./role-switcher-banner";
import { StafDashboard } from "./staf-dashboard";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e"];
const TODAY = "2026-09-22";

// English Trend Data for Executive Analytics
const attendanceTrendsData = [
  { month: "Apr", present: 48, late: 2, leave: 4 },
  { month: "May", present: 52, late: 3, leave: 3 },
  { month: "Jun", present: 50, late: 1, leave: 5 },
  { month: "Jul", present: 53, late: 2, leave: 2 },
  { month: "Aug", present: 51, late: 4, leave: 6 },
  { month: "Sep", present: 54, late: 1, leave: 3 },
];

const leaveDistributionData = [
  { category: "Annual Vacation", count: 28 },
  { category: "Medical Leave", count: 12 },
  { category: "Emergency Leave", count: 6 },
  { category: "Maternity / Parental", count: 4 },
  { category: "Unpaid Leave", count: 2 },
];

function ExecutiveStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = "default",
  color,
  href,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  badgeText?: string;
  badgeVariant?: "default" | "emerald" | "amber" | "blue";
  color: string;
  href?: string;
}) {
  const badgeStyles = {
    default: "border-border bg-muted/60 text-muted-foreground",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  const content = (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
      <CardContent className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">{title}</span>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shadow-2xs", color)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <div className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">{value}</div>
          {badgeText && (
            <span className={cn("rounded-full border px-2 py-0.5 font-medium text-[11px]", badgeStyles[badgeVariant])}>
              {badgeText}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t pt-2.5 text-xs text-muted-foreground">
          <span className="truncate">{subtitle}</span>
          {href && (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function HrDashboard() {
  const currentUser = useHrAuth((s) => s.currentUser);

  const renderDashboard = () => {
    if (currentUser?.role === "ketua") {
      return <PenyeliaDashboard />;
    }
    if (currentUser?.role === "staf") {
      return <StafDashboard />;
    }
    return <AdminDashboardContent />;
  };

  return (
    <div className="space-y-6">
      <RoleSwitcherBanner />
      {renderDashboard()}
    </div>
  );
}

function AdminDashboardContent() {
  const router = useRouter();
  const currentUser = useHrAuth((s) => s.currentUser);
  const logout = useHrAuth((s) => s.logout);
  const staff = useHrStore((s) => s.staff);
  const kehadiran = useHrStore((s) => s.kehadiran);
  const permohonanCuti = useHrStore((s) => s.permohonanCuti);

  const todayKehadiran = kehadiran.filter((k) => k.tarikh === TODAY);
  const hadirHariIni = todayKehadiran.filter((k) => ["Hadir", "Lewat", "Keluar Pejabat"].includes(k.status)).length;
  const cutiHariIni = todayKehadiran.filter((k) => k.status === "Cuti").length;
  const wfhHariIni = todayKehadiran.filter((k) => k.status === "WFH").length;
  const absentHariIni = todayKehadiran.filter((k) => k.status === "Tidak Hadir").length;
  const pendingApproval = permohonanCuti.filter((c) => c.status === "Menunggu").length;

  const activeStaff = staff.filter((s) => s.statusPerkhidmatan === "Aktif").length;
  const attendanceRate = staff.length > 0 ? Math.round(((hadirHariIni + wfhHariIni) / staff.length) * 100) : 0;

  const handleLogout = () => {
    logout();
    toast.success("Successfully signed out.");
    router.push("/auth/hr/login");
  };

  const handleExport = () => {
    toast.success("Workforce Attendance & Leave Report (Q3 2026) exported successfully.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Executive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">
              Executive Workforce Overview
            </h1>
            <Badge
              variant="outline"
              className="border-blue-500/20 bg-blue-500/10 text-blue-600 text-xs font-semibold dark:text-blue-400"
            >
              Corporate HR
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground text-sm">
            Welcome back, {currentUser?.name} — Human Resources Operations & Global People Strategy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleExport} className="h-9 gap-1.5 text-xs shadow-2xs">
            <Download className="h-3.5 w-3.5" />
            Export Report
          </Button>
          <Link href="/dashboard/hr/kakitangan">
            <Button
              size="sm"
              className="h-9 gap-1.5 bg-blue-600 font-semibold text-white text-xs hover:bg-blue-700 shadow-2xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add Employee
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* 4 Corporate KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ExecutiveStatCard
          title="Total Workforce"
          value={staff.length}
          subtitle={`${activeStaff} Active Personnel across 4 depts`}
          icon={Users}
          badgeText="+4.8% YoY"
          badgeVariant="blue"
          color="bg-blue-600 text-white"
          href="/dashboard/hr/kakitangan"
        />
        <ExecutiveStatCard
          title="Present Today"
          value={hadirHariIni + wfhHariIni}
          subtitle={`${hadirHariIni} On-site · ${wfhHariIni} Remote (WFH)`}
          icon={CheckCircle2}
          badgeText={`${attendanceRate}% Rate`}
          badgeVariant="emerald"
          color="bg-emerald-600 text-white"
          href="/dashboard/hr/kehadiran"
        />
        <ExecutiveStatCard
          title="On Time-Off"
          value={cutiHariIni}
          subtitle={`${absentHariIni} unplanned absences today`}
          icon={CalendarDays}
          badgeText="Active Leaves"
          badgeVariant="amber"
          color="bg-amber-600 text-white"
          href="/dashboard/hr/cuti"
        />
        <ExecutiveStatCard
          title="Pending Approvals"
          value={pendingApproval}
          subtitle="Time-off & leave requests in queue"
          icon={Clock}
          badgeText={pendingApproval > 0 ? "Action Needed" : "All Clear"}
          badgeVariant={pendingApproval > 0 ? "amber" : "emerald"}
          color="bg-violet-600 text-white"
          href="/dashboard/hr/kelulusan"
        />
      </div>

      {/* Enterprise HR Modules Quick Access Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/dashboard/hr/recruitment">
          <Card className="group border-border/60 bg-gradient-to-br from-purple-500/5 via-card to-card transition-all hover:border-purple-500/40 hover:shadow-xs cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                    Recruitment & ATS
                  </h4>
                  <p className="text-[11px] text-muted-foreground">4 Open Positions • 6 Active Candidates</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-purple-600 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/hr/performance">
          <Card className="group border-border/60 bg-gradient-to-br from-amber-500/5 via-card to-card transition-all hover:border-amber-500/40 hover:shadow-xs cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground group-hover:text-amber-600 transition-colors">
                    Performance & OKRs
                  </h4>
                  <p className="text-[11px] text-muted-foreground">Q3 Review Cycle • 87.5% Appraisals Signed</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-amber-600 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Attendance Trends AreaChart */}
        <Card className="border-border/60 lg:col-span-4 shadow-xs">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="font-bold text-base text-foreground">Attendance & Workforce Dynamics</CardTitle>
                <CardDescription className="text-xs">
                  Monthly trend of present personnel, approved leaves, and punctuality
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="self-start sm:self-auto border-emerald-500/20 bg-emerald-500/10 text-emerald-600 text-xs font-semibold dark:text-emerald-400"
              >
                +3.2% Consistency
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLeave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-[11px] fill-muted-foreground"
                  />
                  <YAxis tickLine={false} axisLine={false} className="text-[11px] fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Area
                    type="monotone"
                    dataKey="present"
                    name="Present (Staff)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPresent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="leave"
                    name="On Leave"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLeave)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Categorized Leave Distribution Donut Chart */}
        <Card className="border-border/60 lg:col-span-3 shadow-xs">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-bold text-base text-foreground">Leave Distribution</CardTitle>
                <CardDescription className="text-xs">Breakdown by approved leave types for 2026</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                52 Applications
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-2">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="category"
                  >
                    {leaveDistributionData.map((item, index) => (
                      <Cell key={item.category} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              {leaveDistributionData.map((d, i) => (
                <div key={d.category} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="truncate text-muted-foreground">{d.category}</span>
                  <span className="ml-auto font-bold text-foreground">{d.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notice Board & Employee Milestones */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Notice Board */}
        <Card className="border-border/60 lg:col-span-4 shadow-xs">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                <CardTitle className="font-bold text-base text-foreground">Company Notice Board</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                3 Updates
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-2 space-y-3">
            {announcementsData.map((ann) => (
              <div
                key={ann.id}
                className="rounded-lg border bg-muted/20 p-3.5 transition-all hover:bg-muted/40 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{ann.title}</span>
                    {ann.priority === "high" && (
                      <Badge className="h-4 px-1.5 bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px]">
                        Priority
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{ann.date}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{ann.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Milestones & Celebrations */}
        <Card className="border-border/60 lg:col-span-3 shadow-xs">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PartyPopper className="h-4 w-4 text-amber-500" />
                <CardTitle className="font-bold text-base text-foreground">Upcoming Milestones</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                This Week
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-2 space-y-3">
            <div className="flex items-start gap-3 rounded-lg border bg-card p-3 shadow-2xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h5 className="font-semibold text-xs text-foreground">Nurul Izzah — 6-Year Anniversary</h5>
                <p className="text-[11px] text-muted-foreground">Senior Financial Analyst • Joined Sep 2020</p>
                <span className="text-[10px] text-primary font-medium mt-1 inline-block">Celebrating on Sep 25</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border bg-card p-3 shadow-2xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h5 className="font-semibold text-xs text-foreground">Khairul Anuar — Birthday Celebration</h5>
                <p className="text-[11px] text-muted-foreground">Director of Global Operations</p>
                <span className="text-[10px] text-primary font-medium mt-1 inline-block">
                  Sep 28 · Birthday Card Open
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border bg-card p-3 shadow-2xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h5 className="font-semibold text-xs text-foreground">Mohd Hafiz — Quarterly Cloud Review</h5>
                <p className="text-[11px] text-muted-foreground">Engineering Directorship Milestone</p>
                <span className="text-[10px] text-primary font-medium mt-1 inline-block">
                  Oct 02 · Presentation scheduled
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Actions and Today Live Roster Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Pending Approvals Action Queue */}
        <Card className="border-border/60 lg:col-span-4 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-3">
            <div>
              <CardTitle className="font-bold text-base text-foreground">Action Required: Pending Leaves</CardTitle>
              <CardDescription className="text-xs">Requests awaiting supervisory or HR authorization</CardDescription>
            </div>
            <Link href="/dashboard/hr/kelulusan">
              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                Review All
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="divide-y divide-border/50">
              {permohonanCuti.slice(0, 3).map((cuti) => {
                const pemohon = staff.find((s) => s.id === cuti.stafId);
                const isPending = cuti.status === "Menunggu";
                return (
                  <div key={cuti.id} className="flex items-center justify-between py-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-600 text-xs dark:text-blue-400">
                        {pemohon?.nama.charAt(0) ?? "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{pemohon?.nama ?? "Staff Member"}</p>
                        <p className="text-muted-foreground text-[11px]">
                          {cuti.jenisCuti} • {cuti.bilanganHari} Day(s) ({cuti.tarikhMula})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          isPending
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-600 text-[11px] font-semibold dark:text-amber-400"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold dark:text-emerald-400"
                        }
                      >
                        {isPending ? "Pending Review" : "Approved"}
                      </Badge>
                      <Link href="/dashboard/hr/kelulusan">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Workforce Presence Feed */}
        <Card className="border-border/60 lg:col-span-3 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-3">
            <div>
              <CardTitle className="font-bold text-base text-foreground">Today&apos;s Presence Feed</CardTitle>
              <CardDescription className="text-xs">Live check-ins and recorded work modes</CardDescription>
            </div>
            <Link href="/dashboard/hr/kehadiran">
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                Full Log
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
            {/* Status counts mini row */}
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2.5 text-center">
              {[
                { label: "On-site", count: hadirHariIni, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Remote WFH", count: wfhHariIni, color: "text-blue-600 dark:text-blue-400" },
                { label: "On Leave", count: cutiHariIni, color: "text-amber-600 dark:text-amber-400" },
              ].map((s) => (
                <div key={s.label} className={cn("flex flex-col", s.color)}>
                  <span className="font-extrabold text-xl">{s.count}</span>
                  <span className="text-[11px] font-medium">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Recent Check-In Roster Feed */}
            <div className="space-y-1.5 divide-y divide-border/40">
              {todayKehadiran.slice(0, 4).map((k) => {
                const stafItem = staff.find((s) => s.id === k.stafId);
                const statusColor: Record<string, string> = {
                  Hadir: "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
                  Lewat: "text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10",
                  WFH: "text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/10",
                  Cuti: "text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/10",
                  "Tidak Hadir": "text-rose-600 border-rose-500/20 bg-rose-500/10",
                  "Keluar Pejabat": "text-orange-600 border-orange-500/20 bg-orange-500/10",
                };

                const englishStatusMap: Record<string, string> = {
                  Hadir: "Present",
                  Lewat: "Late In",
                  WFH: "Remote (WFH)",
                  Cuti: "On Leave",
                  "Tidak Hadir": "Absent",
                  "Keluar Pejabat": "Out of Office",
                };

                return (
                  <div
                    key={k.id}
                    className="flex items-center justify-between pt-2 pb-1.5 text-xs transition-colors hover:bg-accent/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                        {stafItem?.nama.charAt(0) ?? "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-xs">{stafItem?.nama ?? "Staff Member"}</p>
                        <p className="text-[10px] text-muted-foreground">{stafItem?.bahagian ?? "Operations"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-medium", statusColor[k.status])}>
                      {englishStatusMap[k.status] ?? k.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
