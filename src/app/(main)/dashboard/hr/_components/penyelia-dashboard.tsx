"use client";

import { useState } from "react";

import Link from "next/link";

import { Calendar, CalendarCheck, CheckCircle, Clock, UserCheck, Users, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

const TODAY = "2026-09-22";

const statusBadgeStyles: Record<string, string> = {
  Hadir: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  WFH: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  Cuti: "border-purple-500/20 bg-purple-500/10 text-purple-600",
};

const getStatusDescription = (status: string, waktuMasuk: string | null) => {
  if (status === "WFH") return "Remote (Work From Home)";
  if (status === "Cuti") return "Approved Time-Off";
  return `Check-in: ${waktuMasuk ?? "-"}`;
};

const englishStatusMap: Record<string, string> = {
  Hadir: "Present",
  WFH: "Remote (WFH)",
  Cuti: "On Leave",
  Lewat: "Late In",
  "Tidak Hadir": "Absent",
  "Keluar Pejabat": "Out of Office",
};

export function PenyeliaDashboard() {
  const currentUser = useHrAuth((s) => s.currentUser);
  const staff = useHrStore((s) => s.staff);
  const kehadiran = useHrStore((s) => s.kehadiran);
  const permohonanCuti = useHrStore((s) => s.permohonanCuti);
  const lulusCuti = useHrStore((s) => s.lulusCuti);
  const tolakCuti = useHrStore((s) => s.tolakCuti);

  // Staff under this supervisor (pengurus = "s-002" for Farizal bin Othman)
  const myTeam = staff.filter((s) => s.pengurus === "s-002" || s.id === "s-003" || s.id === "s-004");

  // Pending leaves for this team
  const pendingRequests = permohonanCuti.filter((c) => c.status === "Menunggu");

  // Approval dialog state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"lulus" | "tolak" | null>(null);
  const [catatan, setCatatan] = useState("");

  const handleConfirmAction = () => {
    if (!selectedId || !actionType) return;
    const pelulusId = currentUser?.id ?? "s-002";
    if (actionType === "lulus") {
      lulusCuti(selectedId, catatan, pelulusId);
      toast.success("Leave request has been successfully approved.");
    } else {
      tolakCuti(selectedId, catatan, pelulusId);
      toast.error("Leave request has been declined.");
    }
    setSelectedId(null);
    setActionType(null);
    setCatatan("");
  };

  // Team attendance today
  const teamKehadiranToday = myTeam.map((member) => {
    const rec = kehadiran.find((k) => k.stafId === member.id && k.tarikh === TODAY);
    return {
      staf: member,
      status: rec?.status || "Tidak Hadir",
      waktuMasuk: rec?.waktuMasuk || "-",
      lokasi: rec?.lokasi || "Office",
    };
  });

  const hadirCount = teamKehadiranToday.filter((t) => ["Hadir", "Lewat", "WFH"].includes(t.status)).length;
  const cutiCount = teamKehadiranToday.filter((t) => t.status === "Cuti").length;

  return (
    <div className="space-y-6">
      {/* Supervisor Welcome Header */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-r from-amber-500/10 via-background to-background p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-2xs">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight sm:text-2xl">Team Operations Command</h1>
              <Badge className="border-amber-500/20 bg-amber-500/15 text-amber-700 text-xs dark:text-amber-300">
                Supervisor Portal
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Welcome, <strong>{currentUser?.name}</strong> • Direct report roster and leave approval queue.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/hr/cuti">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs shadow-2xs">
              <Calendar className="h-3.5 w-3.5" />
              My Time Off
            </Button>
          </Link>
          <Link href="/dashboard/hr/kelulusan">
            <Button size="sm" className="h-9 gap-1.5 bg-amber-600 text-white text-xs hover:bg-amber-700 shadow-2xs">
              <CheckCircle className="h-3.5 w-3.5" />
              Approvals Queue ({pendingRequests.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Supervisor Team Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">Direct Reports</p>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 font-extrabold text-2xl tracking-tight">{myTeam.length}</p>
            <p className="text-[11px] text-muted-foreground">Active team personnel</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">Present Today</p>
              <CalendarCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 font-extrabold text-2xl tracking-tight text-emerald-600 dark:text-emerald-400">
              {hadirCount} / {myTeam.length}
            </p>
            <p className="text-[11px] text-muted-foreground">Team active participation</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">On Time-Off</p>
              <Calendar className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-2 font-extrabold text-2xl tracking-tight">{cutiCount}</p>
            <p className="text-[11px] text-muted-foreground">Scheduled off duty today</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-amber-700 text-xs uppercase tracking-wider dark:text-amber-400">
                Action Needed
              </p>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 font-extrabold text-2xl tracking-tight text-amber-600 dark:text-amber-400">
              {pendingRequests.length}
            </p>
            <p className="text-[11px] text-muted-foreground">Awaiting your approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Pending Requests Direct Approvals */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base tracking-tight">Pending Leave Applications</h2>
              <p className="text-xs text-muted-foreground">Direct review of team time-off requests</p>
            </div>
            <Link href="/dashboard/hr/kelulusan" className="text-primary text-xs hover:underline">
              Full Queue
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <Card className="border-dashed shadow-2xs">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <CheckCircle className="mb-2 h-8 w-8 text-emerald-500" />
                <p className="font-semibold text-foreground">No pending requests</p>
                <p className="mt-1 text-xs">All direct report leave applications have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => {
                const member = staff.find((s) => s.id === req.stafId);
                const namaStaf = member?.nama ?? "Staff Member";
                return (
                  <Card
                    key={req.id}
                    className="border-amber-500/25 bg-card transition-all hover:border-amber-500/40 shadow-2xs"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="mt-0.5 h-10 w-10 shrink-0 border">
                            <AvatarFallback className="bg-primary/10 font-bold text-primary text-xs">
                              {getInitials(namaStaf)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{namaStaf}</span>
                              <Badge
                                variant="outline"
                                className="border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-600"
                              >
                                {req.jenisCuti}
                              </Badge>
                            </div>
                            <p className="mt-0.5 text-muted-foreground text-xs">
                              {req.tarikhMula} to {req.tarikhAkhir} ({req.bilanganHari} days)
                            </p>
                            <p className="mt-1 text-foreground/80 text-xs italic">&quot;{req.sebab}&quot;</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 border-destructive/30 text-destructive text-xs hover:bg-destructive/10"
                            onClick={() => {
                              setSelectedId(req.id);
                              setActionType("tolak");
                            }}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 gap-1 bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                            onClick={() => {
                              setSelectedId(req.id);
                              setActionType("lulus");
                            }}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Team Members List */}
          <Card className="shadow-2xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center justify-between font-semibold text-sm">
                <span>Direct Reports Roster ({myTeam.length})</span>
                <Link
                  href="/dashboard/hr/kakitangan"
                  className="font-normal text-muted-foreground text-xs hover:text-foreground"
                >
                  Full Directory
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {myTeam.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3.5 px-4 text-xs transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-xs font-semibold">
                          {getInitials(m.nama)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{m.nama}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {m.jawatan} • {m.bahagian}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600"
                      >
                        {m.statusPerkhidmatan === "Aktif" ? "Active" : m.statusPerkhidmatan}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Team Attendance Table Today */}
        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base tracking-tight">Today&apos;s Team Presence</h2>
            <Link href="/dashboard/hr/kehadiran" className="text-primary text-xs hover:underline">
              Full Timesheet
            </Link>
          </div>

          <Card className="shadow-2xs">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {teamKehadiranToday.map((t) => (
                  <div key={t.staf.id} className="flex items-center justify-between p-3.5 px-4 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{t.staf.nama}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {getStatusDescription(t.status, t.waktuMasuk)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        statusBadgeStyles[t.status] ?? "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {englishStatusMap[t.status] ?? t.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decision Dialog */}
      <Dialog open={!!selectedId} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "lulus" ? "Approve Time-Off Request" : "Decline Time-Off Request"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="decision-catatan">Supervisor Review Notes (Optional)</Label>
              <Textarea
                id="decision-catatan"
                placeholder={
                  actionType === "lulus"
                    ? "e.g. Approved. Please coordinate handover before start date."
                    : "e.g. Request declined due to project delivery schedule."
                }
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className={
                  actionType === "lulus"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-destructive text-white hover:bg-destructive/90"
                }
                onClick={handleConfirmAction}
              >
                {actionType === "lulus" ? "Confirm Approval" : "Confirm Decline"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
