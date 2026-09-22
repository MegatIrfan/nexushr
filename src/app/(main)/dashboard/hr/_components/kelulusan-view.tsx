"use client";

import { useState } from "react";

import { cn } from "cn";
import { CheckCircle, ClipboardCheck, Clock, Filter, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { StatusCuti } from "@/data/hr-data";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

const statusColors: Record<StatusCuti, string> = {
  Menunggu: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Diluluskan: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Ditolak: "border-destructive/20 bg-destructive/10 text-destructive",
  Dibatalkan: "border-border bg-muted/50 text-muted-foreground",
};

const statusEnglishLabels: Record<StatusCuti, string> = {
  Menunggu: "Pending",
  Diluluskan: "Approved",
  Ditolak: "Declined",
  Dibatalkan: "Cancelled",
};

export function KelulusanView() {
  const currentUser = useHrAuth((s) => s.currentUser);
  const staff = useHrStore((s) => s.staff);
  const permohonanCuti = useHrStore((s) => s.permohonanCuti);
  const lulusCuti = useHrStore((s) => s.lulusCuti);
  const tolakCuti = useHrStore((s) => s.tolakCuti);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [action, setAction] = useState<"lulus" | "tolak" | null>(null);
  const [catatan, setCatatan] = useState("");
  const [filterStatus, setFilterStatus] = useState("Menunggu");

  const canApprove = currentUser?.role === "admin" || currentUser?.role === "ketua";

  const pending = permohonanCuti.filter((c) => c.status === "Menunggu");
  const history = permohonanCuti.filter((c) => c.status !== "Menunggu");

  const handleAction = () => {
    if (!selectedId || !action) return;
    if (!catatan.trim()) {
      toast.error("Please provide review notes before proceeding.");
      return;
    }
    const myStafId = staff.find((s) => s.email === currentUser?.email)?.id ?? "";
    if (action === "lulus") {
      lulusCuti(selectedId, catatan, myStafId);
      toast.success("Time-off application has been approved.");
    } else {
      tolakCuti(selectedId, catatan, myStafId);
      toast.success("Time-off application has been declined.");
    }
    setSelectedId(null);
    setAction(null);
    setCatatan("");
  };

  const openAction = (id: string, act: "lulus" | "tolak") => {
    setSelectedId(id);
    setAction(act);
    setCatatan("");
  };

  const selectedPermohonan = permohonanCuti.find((c) => c.id === selectedId);
  const selectedStaf = staff.find((s) => s.id === selectedPermohonan?.stafId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">
          Approval Queue & Request Reviews
        </h1>
        <p className="text-muted-foreground text-sm">Review, approve, or decline employee time-off requests.</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Pending Review",
            count: pending.length,
            color: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
            icon: Clock,
          },
          {
            label: "Approved Requests",
            count: history.filter((c) => c.status === "Diluluskan").length,
            color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            icon: CheckCircle,
          },
          {
            label: "Declined Requests",
            count: history.filter((c) => c.status === "Ditolak").length,
            color: "border-destructive/20 bg-destructive/10 text-destructive",
            icon: XCircle,
          },
        ].map((s) => (
          <Card key={s.label} className={cn("border shadow-2xs", s.color.split(" ")[0])}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", s.color)}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-extrabold text-2xl tracking-tight">{s.count}</p>
                <p className="text-muted-foreground text-xs">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line">
            <TabsTrigger value="pending">
              Pending Queue
              {pending.length > 0 && (
                <Badge className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full border-0 bg-amber-500 p-0 text-[10px] text-white">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sejarah">Decision Audit History</TabsTrigger>
          </TabsList>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger id="kelulusan-filter" className="h-8 w-40 text-xs sm:hidden bg-card shadow-2xs">
              <Filter className="mr-1.5 h-3 w-3" />
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Pending", "Approved", "Declined", "Cancelled"].map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="pending" className="mt-4">
          <div className="space-y-3">
            {pending.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <ClipboardCheck className="mb-3 h-10 w-10 opacity-30 text-emerald-500" />
                <p className="font-semibold text-foreground">No applications awaiting review.</p>
                <p className="mt-1 text-sm">All employee time-off requests have been reviewed.</p>
              </div>
            )}
            {pending.map((c) => {
              const stafItem = staff.find((s) => s.id === c.stafId);
              return (
                <Card key={c.id} className="transition-all hover:border-primary/40 shadow-2xs">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 font-bold text-amber-700 text-base dark:text-amber-300">
                      {stafItem?.nama.charAt(0) ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{stafItem?.nama}</p>
                        <Badge className="border border-amber-500/20 bg-amber-500/10 text-amber-600 text-xs dark:text-amber-400">
                          Pending Decision
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        <strong className="text-foreground">{c.jenisCuti}</strong> · {c.bilanganHari} days
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {c.tarikhMula} to {c.tarikhAkhir} · Reason: {c.sebab}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Submitted:{" "}
                        {new Date(c.tarikhPermohonan).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {canApprove && (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          id={`btn-tolak-${c.id}`}
                          size="sm"
                          variant="outline"
                          className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive text-xs"
                          onClick={() => openAction(c.id, "tolak")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Decline
                        </Button>
                        <Button
                          id={`btn-lulus-${c.id}`}
                          size="sm"
                          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs"
                          onClick={() => openAction(c.id, "lulus")}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="sejarah" className="mt-4">
          <Card className="shadow-2xs">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Employee</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Category</th>
                      <th className="hidden px-4 py-3.5 text-left font-semibold text-muted-foreground md:table-cell">
                        Date Span
                      </th>
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground">Status</th>
                      <th className="hidden px-4 py-3.5 text-left font-semibold text-muted-foreground lg:table-cell">
                        Reviewer Feedback Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history
                      .sort((a, b) => b.tarikhPermohonan.localeCompare(a.tarikhPermohonan))
                      .map((c) => {
                        const stafItem = staff.find((s) => s.id === c.stafId);
                        return (
                          <tr key={c.id} className="border-b transition-colors last:border-0 hover:bg-accent/40">
                            <td className="px-4 py-3.5 font-semibold text-foreground">{stafItem?.nama ?? "-"}</td>
                            <td className="px-4 py-3.5 text-muted-foreground">{c.jenisCuti}</td>
                            <td className="hidden whitespace-nowrap px-4 py-3.5 text-muted-foreground text-xs md:table-cell">
                              {c.tarikhMula} → {c.tarikhAkhir} ({c.bilanganHari} days)
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge className={cn("border text-xs font-medium", statusColors[c.status])}>
                                {statusEnglishLabels[c.status] ?? c.status}
                              </Badge>
                            </td>
                            <td className="hidden max-w-xs truncate px-4 py-3.5 text-muted-foreground text-xs lg:table-cell">
                              {c.catatanPelulus || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                          No historical decisions recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog
        open={Boolean(selectedId)}
        onOpenChange={() => {
          setSelectedId(null);
          setAction(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{action === "lulus" ? "Approve Time-Off Request" : "Decline Time-Off Request"}</DialogTitle>
          </DialogHeader>
          {selectedPermohonan && (
            <div className="space-y-4">
              <div className="space-y-1 rounded-xl border bg-muted/40 p-4 text-xs">
                <p>
                  <span className="font-semibold text-foreground">Applicant:</span> {selectedStaf?.nama}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Category:</span> {selectedPermohonan.jenisCuti}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Duration:</span> {selectedPermohonan.tarikhMula} to{" "}
                  {selectedPermohonan.tarikhAkhir} ({selectedPermohonan.bilanganHari} days)
                </p>
                <p>
                  <span className="font-semibold text-foreground">Reason:</span> {selectedPermohonan.sebab}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="catatan-pelulus">Reviewer Feedback Notes *</Label>
                <Textarea
                  id="catatan-pelulus"
                  placeholder={
                    action === "lulus"
                      ? "e.g. Approved. Please ensure task handover is complete."
                      : "e.g. Declined due to overlapping project delivery milestones."
                  }
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedId(null);
                    setAction(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  id="btn-confirm-action"
                  className={
                    action === "tolak"
                      ? "bg-destructive text-white hover:bg-destructive/90"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }
                  onClick={handleAction}
                >
                  {action === "lulus" ? "Confirm Approval" : "Confirm Decision"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
