"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { CheckCircle, Clock, ExternalLink, FileText, LogIn, LogOut, PlusCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getInitials } from "@/lib/utils";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

const TODAY = "2026-09-22";

const statusBadgeColors: Record<string, string> = {
  Diluluskan: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]",
  Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]",
  Menunggu: "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]",
  Ditolak: "bg-destructive/10 text-destructive border-destructive/20 text-[10px]",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20 text-[10px]",
};

export function StafDashboard() {
  const currentUser = useHrAuth((s) => s.currentUser);
  const staff = useHrStore((s) => s.staff);
  const kehadiran = useHrStore((s) => s.kehadiran);
  const permohonanCuti = useHrStore((s) => s.permohonanCuti);
  const bakiCuti = useHrStore((s) => s.bakiCuti);
  const checkIn = useHrStore((s) => s.checkIn);
  const checkOut = useHrStore((s) => s.checkOut);

  // Live ticking clock state
  const [time, setTime] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<"Office" | "Remote / WFH" | "Off-Site">("Office");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Find staff record for current user
  const myStaffRecord = staff.find((s) => s.email === currentUser?.email) || staff[2];
  const myStaffId = myStaffRecord?.id || "s-003";

  // Find today's attendance for this staff
  const todayRecord = kehadiran.find((k) => k.stafId === myStaffId && k.tarikh === TODAY);
  const isClockedIn = Boolean(todayRecord?.waktuMasuk);
  const isClockedOut = Boolean(todayRecord?.waktuKeluar);

  // Supervisor info
  const supervisor = staff.find((s) => s.id === myStaffRecord?.pengurus);

  // My leaves
  const myLeaves = permohonanCuti.filter((c) => c.stafId === myStaffId);
  const rawBaki = bakiCuti.find((b) => b.stafId === myStaffId);
  const myBalances = {
    cutiRehat: rawBaki ? rawBaki.cutiTahunan.hak - rawBaki.cutiTahunan.diambil : 14,
    cutiRehatAsal: rawBaki ? rawBaki.cutiTahunan.hak : 20,
    cutiSakit: rawBaki ? rawBaki.cutiSakit.hak - rawBaki.cutiSakit.diambil : 11,
    cutiSakitAsal: rawBaki ? rawBaki.cutiSakit.hak : 15,
    cutiKecemasan: rawBaki ? rawBaki.cutiKecemasan.hak - rawBaki.cutiKecemasan.diambil : 2,
    cutiKecemasanAsal: rawBaki ? rawBaki.cutiKecemasan.hak : 3,
  };

  const handleClockIn = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const locationMapping =
      selectedLocation === "Remote / WFH" ? "WFH" : selectedLocation === "Off-Site" ? "Keluar Pejabat" : "Office";
    checkIn(myStaffId, TODAY, locationMapping);
    toast.success(`Successfully clocked in at ${timeStr} (${selectedLocation})!`);
  };

  const handleClockOut = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    checkOut(myStaffId, TODAY);
    toast.success(`Successfully clocked out at ${timeStr}. Have a restful evening!`);
  };

  const renderStatusBanner = () => {
    if (!isClockedIn) {
      return (
        <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium">
          <div className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
          <span>You have not clocked in for today&apos;s shift yet.</span>
        </div>
      );
    }
    if (isClockedOut) {
      return (
        <div className="flex items-center justify-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Shift completed! Check-in: {todayRecord?.waktuMasuk} • Check-out: {todayRecord?.waktuKeluar}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
        <span>
          Active Duty • Clocked in at {todayRecord?.waktuMasuk} ({todayRecord?.lokasi ?? "Office"})
        </span>
      </div>
    );
  };

  const renderClockButton = () => {
    if (!isClockedIn) {
      return (
        <Button
          onClick={handleClockIn}
          className="h-11 w-full min-w-48 gap-2 bg-emerald-600 font-semibold text-sm text-white shadow-emerald-500/20 shadow-md hover:bg-emerald-700 sm:w-auto"
        >
          <LogIn className="h-4 w-4" />
          Clock In Now
        </Button>
      );
    }
    if (!isClockedOut) {
      return (
        <Button
          onClick={handleClockOut}
          variant="outline"
          className="h-11 w-full min-w-48 gap-2 border-destructive/40 font-semibold text-destructive text-sm hover:bg-destructive/10 sm:w-auto"
        >
          <LogOut className="h-4 w-4" />
          Clock Out (End Shift)
        </Button>
      );
    }
    return (
      <Button disabled variant="outline" className="w-full min-w-48 text-xs sm:w-auto">
        Shift Completed For Today
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Staff Personal Profile Card */}
      <div className="rounded-2xl border bg-gradient-to-r from-emerald-500/10 via-background to-background p-6 shadow-2xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0 border-2 border-emerald-500/30 ring-2 ring-emerald-500/10">
              <AvatarFallback className="bg-emerald-500/15 font-extrabold text-emerald-700 text-lg dark:text-emerald-400">
                {getInitials(currentUser?.name ?? "Staff")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight sm:text-2xl">{currentUser?.name}</h1>
                <Badge className="border-emerald-500/20 bg-emerald-500/15 text-emerald-700 text-xs dark:text-emerald-300">
                  Employee Self-Service
                </Badge>
              </div>
              <p className="mt-0.5 text-muted-foreground text-xs sm:text-sm">
                {myStaffRecord.jawatan} ({myStaffRecord.gred}) • {myStaffRecord.bahagian}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
                <span>
                  Staff ID: <strong className="text-foreground">{myStaffRecord.noStaf}</strong>
                </span>
                <span>•</span>
                <span>
                  Manager: <strong className="text-foreground">{supervisor?.nama || "Farizal bin Othman"}</strong>
                </span>
                <span>•</span>
                <span>
                  Status: <strong className="text-emerald-600 dark:text-emerald-400">Active Employment</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <Link href="/dashboard/hr/dokumen">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs shadow-2xs">
                <FileText className="h-3.5 w-3.5" />
                My Documents
              </Button>
            </Link>
            <Link href="/dashboard/hr/cuti">
              <Button
                size="sm"
                className="h-9 gap-1.5 bg-emerald-600 font-semibold text-white text-xs hover:bg-emerald-700 shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Apply for Leave
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: Live Clock In / Out & Attendance stats */}
        <div className="space-y-6 lg:col-span-6">
          {/* Live Interactive Clock-In Widget */}
          <Card className="overflow-hidden border-primary/25 shadow-2xs">
            <div className="flex items-center justify-between border-b bg-muted/40 p-3 px-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Daily Attendance Tracker
                </span>
              </div>
              <Badge variant="outline" className="font-mono text-xs font-semibold">
                {TODAY}
              </Badge>
            </div>

            <CardContent className="space-y-5 p-6 text-center">
              {/* Live Digital Clock */}
              <div>
                <div className="font-extrabold font-mono text-3xl text-foreground tracking-tight sm:text-4xl">
                  {time || "08:15:00 AM"}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">Standard Office Schedule: 08:00 AM – 05:00 PM</p>
              </div>

              {/* Status Banner */}
              <div className="rounded-xl border p-3 text-xs bg-muted/20">{renderStatusBanner()}</div>

              {/* Location Mode Selector */}
              {!isClockedOut && (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="font-medium text-muted-foreground">Work Mode:</span>
                  <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
                    {(["Office", "Remote / WFH", "Off-Site"] as const).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setSelectedLocation(loc)}
                        className={`rounded-md px-2.5 py-1 font-medium text-xs transition-all ${
                          selectedLocation === loc
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clock Action Buttons */}
              <div className="pt-1">{renderClockButton()}</div>
            </CardContent>
          </Card>

          {/* Monthly Attendance Summary for Staff */}
          <Card className="shadow-2xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-semibold text-sm">My Attendance Overview (This Month)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 p-4 text-center">
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-muted-foreground text-xs font-medium">On-Site</p>
                <p className="mt-1 font-bold text-emerald-600 text-xl dark:text-emerald-400">18</p>
                <p className="text-[10px] text-muted-foreground">Workdays</p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-muted-foreground text-xs font-medium">Late In</p>
                <p className="mt-1 font-bold text-amber-600 text-xl dark:text-amber-400">0</p>
                <p className="text-[10px] text-muted-foreground">Instances</p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-muted-foreground text-xs font-medium">Remote WFH</p>
                <p className="mt-1 font-bold text-blue-600 text-xl dark:text-blue-400">2</p>
                <p className="text-[10px] text-muted-foreground">Approved Days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Leave Balances & Leave Status */}
        <div className="space-y-6 lg:col-span-6">
          {/* Leave Balances Gauges */}
          <Card className="shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <div>
                <CardTitle className="font-semibold text-sm">Time-Off Allowances (FY 2026)</CardTitle>
                <p className="text-xs text-muted-foreground">Current accrued and remaining quotas</p>
              </div>
              <Link href="/dashboard/hr/cuti" className="flex items-center gap-1 text-primary text-xs hover:underline">
                Manage leaves <ExternalLink className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {/* Annual Vacation Leave */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">Annual Vacation Leave</span>
                  <span className="font-semibold text-primary">
                    {myBalances.cutiRehat} / {myBalances.cutiRehatAsal} days remaining
                  </span>
                </div>
                <Progress value={(myBalances.cutiRehat / myBalances.cutiRehatAsal) * 100} className="h-2" />
              </div>

              {/* Medical Leave */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">Medical / Sick Leave</span>
                  <span className="font-semibold text-emerald-600">
                    {myBalances.cutiSakit} / {myBalances.cutiSakitAsal} days remaining
                  </span>
                </div>
                <Progress
                  value={(myBalances.cutiSakit / myBalances.cutiSakitAsal) * 100}
                  className="h-2 bg-muted [&>div]:bg-emerald-500"
                />
              </div>

              {/* Emergency Leave */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">Emergency Compassionate Leave</span>
                  <span className="font-semibold text-amber-600">
                    {myBalances.cutiKecemasan} / {myBalances.cutiKecemasanAsal} days remaining
                  </span>
                </div>
                <Progress
                  value={(myBalances.cutiKecemasan / myBalances.cutiKecemasanAsal) * 100}
                  className="h-2 bg-muted [&>div]:bg-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* My Leave Applications History & Status */}
          <Card className="shadow-2xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-semibold text-sm">Recent Time-Off Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {myLeaves.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-xs">No recent leave requests filed yet.</div>
              ) : (
                <div className="divide-y divide-border/50">
                  {myLeaves.map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-3.5 px-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{l.jenisCuti}</span>
                          <span className="text-muted-foreground">• {l.bilanganHari} days</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {l.tarikhMula} to {l.tarikhAkhir}
                        </p>
                        {l.catatanPelulus && (
                          <p className="mt-0.5 text-[10px] text-muted-foreground italic">
                            Supervisor feedback: &quot;{l.catatanPelulus}&quot;
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={statusBadgeColors[l.status] ?? "bg-muted text-[10px] text-muted-foreground"}
                      >
                        {l.status === "Menunggu"
                          ? "Pending"
                          : l.status === "Diluluskan"
                            ? "Approved"
                            : l.status === "Ditolak"
                              ? "Rejected"
                              : l.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
