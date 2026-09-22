"use client";

import { useState } from "react";

import { cn } from "cn";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Filter,
  LogIn,
  LogOut,
  MapPin,
  Monitor,
  Search,
  XCircle,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StatusKehadiran } from "@/data/hr-data";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

const TODAY = "2026-09-22";

const statusConfig: Record<StatusKehadiran, { label: string; color: string; icon: React.ElementType }> = {
  Hadir: {
    label: "Present",
    color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle,
  },
  Lewat: {
    label: "Late In",
    color: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: Clock,
  },
  "Tidak Hadir": { label: "Absent", color: "border-destructive/20 bg-destructive/10 text-destructive", icon: XCircle },
  WFH: {
    label: "Remote (WFH)",
    color: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: Monitor,
  },
  "Keluar Pejabat": {
    label: "Out of Office",
    color: "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
    icon: MapPin,
  },
  Cuti: {
    label: "On Leave",
    color: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    icon: CalendarDays,
  },
};

const chartData = [
  { day: "Mon", present: 6, wfh: 1, leave: 1 },
  { day: "Tue", present: 5, wfh: 2, leave: 1 },
  { day: "Wed", present: 7, wfh: 0, leave: 1 },
  { day: "Thu", present: 6, wfh: 1, leave: 1 },
  { day: "Fri", present: 5, wfh: 1, leave: 2 },
];

export function KehadiranView() {
  const currentUser = useHrAuth((s) => s.currentUser);
  const staff = useHrStore((s) => s.staff);
  const kehadiran = useHrStore((s) => s.kehadiran);
  const checkIn = useHrStore((s) => s.checkIn);
  const checkOut = useHrStore((s) => s.checkOut);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTarikh, setFilterTarikh] = useState(TODAY);

  // My attendance (for employee)
  const myStaf = staff.find((s) => s.email === currentUser?.email);
  const myTodayRecord = kehadiran.find((k) => k.stafId === myStaf?.id && k.tarikh === TODAY);

  const handleCheckIn = () => {
    if (!myStaf) return;
    checkIn(myStaf.id, TODAY);
    toast.success("Clock-in recorded successfully.");
  };

  const handleCheckOut = () => {
    if (!myStaf) return;
    checkOut(myStaf.id, TODAY);
    toast.success("Clock-out recorded successfully.");
  };

  // Filtered attendance records
  const filteredRecords = kehadiran
    .filter((k) => {
      const stafItem = staff.find((s) => s.id === k.stafId);
      const q = search.toLowerCase();
      const matchSearch = stafItem?.nama.toLowerCase().includes(q) ?? false;
      const statusLabel = statusConfig[k.status]?.label ?? k.status;
      const matchStatus = filterStatus === "All" || k.status === filterStatus || statusLabel === filterStatus;
      const matchDate = !filterTarikh || k.tarikh === filterTarikh;
      return matchSearch && matchStatus && matchDate;
    })
    .sort((a, b) => b.tarikh.localeCompare(a.tarikh));

  // Today summary
  const todayRecords = kehadiran.filter((k) => k.tarikh === TODAY);
  const summary: Record<StatusKehadiran, number> = {
    Hadir: todayRecords.filter((k) => k.status === "Hadir").length,
    Lewat: todayRecords.filter((k) => k.status === "Lewat").length,
    WFH: todayRecords.filter((k) => k.status === "WFH").length,
    "Tidak Hadir": todayRecords.filter((k) => k.status === "Tidak Hadir").length,
    Cuti: todayRecords.filter((k) => k.status === "Cuti").length,
    "Keluar Pejabat": todayRecords.filter((k) => k.status === "Keluar Pejabat").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">
          Time & Attendance Tracking
        </h1>
        <p className="text-muted-foreground text-sm">
          Real-time daily timesheets, remote check-ins, and attendance reporting.
        </p>
      </div>

      {/* Employee Personal Check-In Widget */}
      {currentUser?.role === "staf" && myStaf && (
        <Card className="border-primary/20 bg-primary/5 shadow-2xs">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-foreground">My Attendance (Today)</p>
              <p className="text-muted-foreground text-sm">
                {myTodayRecord
                  ? `Clock In: ${myTodayRecord.waktuMasuk ?? "-"} · Clock Out: ${myTodayRecord.waktuKeluar ?? "-"}`
                  : "No check-in recorded for today yet."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                id="btn-checkin"
                variant="outline"
                className="gap-2 bg-card shadow-2xs"
                onClick={handleCheckIn}
                disabled={Boolean(myTodayRecord?.waktuMasuk)}
              >
                <LogIn className="h-4 w-4" />
                {myTodayRecord?.waktuMasuk ? `In: ${myTodayRecord.waktuMasuk}` : "Clock In"}
              </Button>
              <Button
                id="btn-checkout"
                variant="outline"
                className="gap-2 bg-card shadow-2xs"
                onClick={handleCheckOut}
                disabled={!myTodayRecord?.waktuMasuk || Boolean(myTodayRecord?.waktuKeluar)}
              >
                <LogOut className="h-4 w-4" />
                {myTodayRecord?.waktuKeluar ? `Out: ${myTodayRecord.waktuKeluar}` : "Clock Out"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="rekod">
        <TabsList variant="line">
          <TabsTrigger value="rekod">Timesheet Records</TabsTrigger>
          <TabsTrigger value="laporan">Weekly Distribution Report</TabsTrigger>
        </TabsList>

        <TabsContent value="rekod" className="mt-4 space-y-4">
          {/* Summary counters */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(Object.entries(summary) as [StatusKehadiran, number][]).map(([status, count]) => {
              const cfg = statusConfig[status];
              return (
                <div key={status} className={cn("rounded-xl border p-3 text-center shadow-2xs", cfg.color)}>
                  <p className="font-extrabold text-2xl tracking-tight">{count}</p>
                  <p className="mt-1 font-semibold text-xs">{cfg.label}</p>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-44 flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="attendance-search"
                placeholder="Filter by employee name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card shadow-2xs"
              />
            </div>
            <Input
              id="attendance-date"
              type="date"
              value={filterTarikh}
              onChange={(e) => setFilterTarikh(e.target.value)}
              className="w-44 bg-card shadow-2xs"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="attendance-filter" className="w-48 bg-card shadow-2xs">
                <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Present", "Late In", "Remote (WFH)", "Out of Office", "On Leave", "Absent"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card className="shadow-2xs">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Employee</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Date</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Clock In</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Clock Out</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Status</th>
                      <th className="hidden px-4 py-3.5 text-left font-semibold text-muted-foreground md:table-cell">
                        Remarks / Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((k) => {
                      const stafItem = staff.find((s) => s.id === k.stafId);
                      const cfg = statusConfig[k.status] ?? statusConfig.Hadir;
                      return (
                        <tr key={k.id} className="border-b transition-colors last:border-0 hover:bg-accent/40">
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="font-semibold text-foreground">{stafItem?.nama ?? "-"}</p>
                              <p className="text-muted-foreground text-xs">{stafItem?.bahagian}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground text-xs">
                            {new Date(k.tarikh).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs">
                            {k.waktuMasuk ?? <span className="text-muted-foreground">-</span>}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs">
                            {k.waktuKeluar ?? <span className="text-muted-foreground">-</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge className={cn("border text-xs font-medium", cfg.color)}>{cfg.label}</Badge>
                          </td>
                          <td className="hidden px-4 py-3.5 text-muted-foreground text-xs md:table-cell">
                            {k.sebab || "-"}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                          No attendance records matching the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laporan" className="mt-4">
          <Card className="shadow-2xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Weekly Workforce Presence Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="present" name="Present (Office)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wfh" name="Remote (WFH)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leave" name="On Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-muted-foreground text-xs">
                Current reporting cycle (Sep 22 - Sep 26, 2026)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
