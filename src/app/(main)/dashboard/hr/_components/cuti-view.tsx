"use client";

import { useState } from "react";

import { cn } from "cn";
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Filter, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { JenisCuti, StatusCuti } from "@/data/hr-data";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

const statusColors: Record<StatusCuti, string> = {
  Menunggu: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Diluluskan: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Ditolak: "border-destructive/20 bg-destructive/10 text-destructive",
  Dibatalkan: "border-border bg-muted/50 text-muted-foreground",
};

const statusEnglishMap: Record<StatusCuti, string> = {
  Menunggu: "Pending",
  Diluluskan: "Approved",
  Ditolak: "Rejected",
  Dibatalkan: "Cancelled",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function LeaveCalendar({ approvedLeaves }: { approvedLeaves: { start: string; end: string; name: string }[] }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(8); // Sep = 8 (0-indexed)

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isLeaveDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return approvedLeaves.some((l) => dateStr >= l.start && dateStr <= l.end);
  };

  const getLeaveName = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return approvedLeaves.find((l) => dateStr >= l.start && dateStr <= l.end)?.name;
  };

  const today = new Date();
  const isToday = (day: number) =>
    year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevMonth}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-center font-medium text-[11px] text-muted-foreground">
            {d}
          </div>
        ))}
        {["pad-0", "pad-1", "pad-2", "pad-3", "pad-4", "pad-5", "pad-6"].slice(0, firstDay).map((slot) => (
          <div key={slot} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const leave = isLeaveDay(day);
          const name = getLeaveName(day);
          return (
            <div
              key={day}
              title={name ? `${name} - On Leave` : undefined}
              className={cn(
                "flex aspect-square cursor-default items-center justify-center rounded-lg text-xs transition-colors",
                isToday(day) && "font-bold ring-2 ring-primary ring-offset-1",
                leave && "bg-amber-500/20 font-semibold text-amber-700 dark:text-amber-300",
                !leave && !isToday(day) && "hover:bg-accent/50",
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 pt-2 text-muted-foreground text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-amber-500/20 border border-amber-500/30" />
          <span>Scheduled Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm ring-2 ring-primary" />
          <span>Current Day</span>
        </div>
      </div>
    </div>
  );
}

export function CutiView() {
  const currentUser = useHrAuth((s) => s.currentUser);
  const staff = useHrStore((s) => s.staff);
  const permohonanCuti = useHrStore((s) => s.permohonanCuti);
  const bakiCuti = useHrStore((s) => s.bakiCuti);
  const mohonCuti = useHrStore((s) => s.mohonCuti);
  const batalCuti = useHrStore((s) => s.batalCuti);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [form, setForm] = useState({
    jenisCuti: "Cuti Tahunan" as JenisCuti,
    tarikhMula: "",
    tarikhAkhir: "",
    sebab: "",
  });

  const myStaf = staff.find((s) => s.email === currentUser?.email);
  const myBaki = bakiCuti.find((b) => b.stafId === myStaf?.id);

  // For admin/supervisor show all, for employee show own
  const visiblePermohonan =
    currentUser?.role === "staf" ? permohonanCuti.filter((c) => c.stafId === myStaf?.id) : permohonanCuti;

  const filtered = visiblePermohonan.filter((c) => {
    const mapped = statusEnglishMap[c.status] ?? c.status;
    return filterStatus === "All" || c.status === filterStatus || mapped === filterStatus;
  });

  const approvedLeaves = permohonanCuti
    .filter((c) => c.status === "Diluluskan")
    .map((c) => {
      const s = staff.find((st) => st.id === c.stafId);
      return { start: c.tarikhMula, end: c.tarikhAkhir, name: s?.nama ?? "Staff" };
    });

  const calcDays = () => {
    if (!form.tarikhMula || !form.tarikhAkhir) return 0;
    const diff = new Date(form.tarikhAkhir).getTime() - new Date(form.tarikhMula).getTime();
    return Math.max(0, Math.floor(diff / 86400000) + 1);
  };

  const handleSubmit = () => {
    if (!form.tarikhMula || !form.tarikhAkhir || !form.sebab) {
      toast.error("Please fill in all application fields.");
      return;
    }
    if (!myStaf) {
      toast.error("Staff record not found.");
      return;
    }
    mohonCuti({
      stafId: myStaf.id,
      jenisCuti: form.jenisCuti,
      tarikhMula: form.tarikhMula,
      tarikhAkhir: form.tarikhAkhir,
      bilanganHari: calcDays(),
      sebab: form.sebab,
      tarikhPermohonan: new Date().toISOString().slice(0, 10),
      pelulusId: myStaf.pengurus ?? "",
    });
    toast.success("Time-off application successfully submitted!");
    setDialogOpen(false);
    setForm({ jenisCuti: "Cuti Tahunan", tarikhMula: "", tarikhAkhir: "", sebab: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">
            Leave & Time-Off Management
          </h1>
          <p className="text-muted-foreground text-sm">Request, track, and manage company time-off allowances.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gap-2 self-start bg-blue-600 text-white hover:bg-blue-700 shadow-2xs sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Request Time-Off
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left column */}
        <div className="flex flex-col gap-4 xl:col-span-8">
          {/* Leave balance */}
          {myBaki && (
            <Card className="shadow-2xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  My Time-Off Allowances ({new Date().getFullYear()})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    {
                      label: "Annual Leave",
                      hak: myBaki.cutiTahunan.hak,
                      diambil: myBaki.cutiTahunan.diambil,
                    },
                    {
                      label: "Medical Leave",
                      hak: myBaki.cutiSakit.hak,
                      diambil: myBaki.cutiSakit.diambil,
                    },
                    {
                      label: "Emergency Leave",
                      hak: myBaki.cutiKecemasan.hak,
                      diambil: myBaki.cutiKecemasan.diambil,
                    },
                    {
                      label: "Parental Leave",
                      hak: myBaki.cutiBersalin.hak,
                      diambil: myBaki.cutiBersalin.diambil,
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-xs">{item.label}</span>
                        <span className="font-bold text-xs">
                          {item.hak - item.diambil} <span className="font-normal text-muted-foreground">left</span>
                        </span>
                      </div>
                      <Progress value={item.hak > 0 ? (item.diambil / item.hak) * 100 : 0} className="h-2" />
                      <p className="text-muted-foreground text-[11px]">
                        {item.diambil} / {item.hak} days utilized
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* History */}
          <Card className="shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Time-Off Applications History</CardTitle>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="cuti-filter" className="h-8 w-40 text-xs bg-card shadow-2xs">
                    <Filter className="mr-1.5 h-3 w-3" />
                    <SelectValue placeholder="Status Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "Pending", "Approved", "Rejected", "Cancelled"].map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {currentUser?.role !== "staf" && (
                        <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Employee</th>
                      )}
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Category</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Date Span</th>
                      <th className="px-4 py-3.5 text-center font-semibold text-muted-foreground">Duration</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Status</th>
                      {currentUser?.role === "staf" && <th className="px-4 py-3.5" />}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered
                      .sort((a, b) => b.tarikhPermohonan.localeCompare(a.tarikhPermohonan))
                      .map((c) => {
                        const stafItem = staff.find((s) => s.id === c.stafId);
                        return (
                          <tr key={c.id} className="border-b transition-colors last:border-0 hover:bg-accent/40">
                            {currentUser?.role !== "staf" && (
                              <td className="px-4 py-3.5 font-semibold text-foreground">{stafItem?.nama ?? "-"}</td>
                            )}
                            <td className="px-4 py-3.5 text-muted-foreground">{c.jenisCuti}</td>
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <span className="text-xs font-mono">
                                {c.tarikhMula} → {c.tarikhAkhir}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center font-semibold">{c.bilanganHari} d</td>
                            <td className="px-4 py-3.5">
                              <Badge className={cn("border text-xs font-medium", statusColors[c.status])}>
                                {statusEnglishMap[c.status] ?? c.status}
                              </Badge>
                            </td>
                            {currentUser?.role === "staf" && (
                              <td className="px-4 py-3.5 text-right">
                                {c.status === "Menunggu" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 gap-1 text-muted-foreground text-xs hover:text-destructive"
                                    onClick={() => {
                                      batalCuti(c.id);
                                      toast.success("Application cancelled.");
                                    }}
                                  >
                                    <X className="h-3 w-3" /> Cancel
                                  </Button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                          <ClipboardList className="mx-auto mb-2 h-8 w-8 opacity-30" />
                          No time-off requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coverage Calendar */}
        <Card className="h-fit xl:col-span-4 shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              Coverage & Leave Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeaveCalendar approvedLeaves={approvedLeaves} />
          </CardContent>
        </Card>
      </div>

      {/* Apply Leave Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for Time-Off</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cuti-jenis">Time-Off Category</Label>
              <Select value={form.jenisCuti} onValueChange={(v) => setForm({ ...form, jenisCuti: v as JenisCuti })}>
                <SelectTrigger id="cuti-jenis">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Cuti Tahunan",
                    "Cuti Sakit",
                    "Cuti Kecemasan",
                    "Cuti Separuh Gaji",
                    "Cuti Tanpa Rekod",
                    "Cuti Bersalin",
                  ].map((j) => (
                    <SelectItem key={j} value={j}>
                      {j === "Cuti Tahunan"
                        ? "Annual Vacation Leave"
                        : j === "Cuti Sakit"
                          ? "Medical / Sick Leave"
                          : j === "Cuti Kecemasan"
                            ? "Emergency Compassionate Leave"
                            : j === "Cuti Separuh Gaji"
                              ? "Half-Pay Leave"
                              : j === "Cuti Tanpa Rekod"
                                ? "Unrecorded Leave"
                                : "Parental / Maternity Leave"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cuti-mula">Start Date</Label>
                <Input
                  id="cuti-mula"
                  type="date"
                  value={form.tarikhMula}
                  onChange={(e) => setForm({ ...form, tarikhMula: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cuti-akhir">End Date</Label>
                <Input
                  id="cuti-akhir"
                  type="date"
                  min={form.tarikhMula}
                  value={form.tarikhAkhir}
                  onChange={(e) => setForm({ ...form, tarikhAkhir: e.target.value })}
                />
              </div>
            </div>
            {calcDays() > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                Total Duration: <strong>{calcDays()} working days</strong>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="cuti-sebab">Reason & Handover Notes</Label>
              <Textarea
                id="cuti-sebab"
                placeholder="State your reason and task handover arrangements..."
                rows={3}
                value={form.sebab}
                onChange={(e) => setForm({ ...form, sebab: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button id="btn-submit-cuti" onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
