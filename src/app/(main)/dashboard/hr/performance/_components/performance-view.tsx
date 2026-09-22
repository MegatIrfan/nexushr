"use client";

import { useId, useState } from "react";

import {
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CompanyOkr, PerformanceAppraisal, Staf } from "@/data/hr-data";
import {
  performanceAppraisalsData as initialAppraisals,
  companyOkrsData as initialOkrs,
  staffData,
} from "@/data/hr-data";
import { getInitials } from "@/lib/utils";

export function PerformanceView() {
  const [okrs, setOkrs] = useState<CompanyOkr[]>(initialOkrs);
  const [appraisals, setAppraisals] = useState<PerformanceAppraisal[]>(initialAppraisals);
  const [activeTab, setActiveTab] = useState("okrs");
  const [search, setSearch] = useState("");
  const [newReviewOpen, setNewReviewOpen] = useState(false);

  // Form State
  const [selectedStaffId, setSelectedStaffId] = useState("s-003");
  const [reviewBand, setReviewBand] = useState<PerformanceAppraisal["performanceBand"]>("Exceeds Expectations");
  const [reviewRating, setReviewRating] = useState("4.7");
  const [reviewNotes, setReviewNotes] = useState("");

  const searchId = useId();

  const staffMap = new Map<string, Staf>(staffData.map((s) => [s.id, s]));

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppraisal: PerformanceAppraisal = {
      id: `appr-${appraisals.length + 1}`,
      stafId: selectedStaffId,
      reviewerId: "s-001",
      cycle: "Q3 2026",
      rating: Number.parseFloat(reviewRating) || 4.5,
      performanceBand: reviewBand,
      status: "Completed",
      feedbackSummary: reviewNotes || "Demonstrated outstanding leadership and execution on quarterly deliverables.",
    };

    setAppraisals([newAppraisal, ...appraisals]);
    setNewReviewOpen(false);
    setReviewNotes("");
    toast.success("Performance review submitted and published to employee records!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">Performance & OKRs</h1>
            <Badge
              variant="outline"
              className="border-purple-500/30 bg-purple-500/10 font-semibold text-purple-600 text-xs dark:text-purple-400"
            >
              Q3 2026 Review Cycle
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Company-wide objective tracking, quarterly appraisal cycles, and employee growth milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setNewReviewOpen(true)}
            className="gap-1.5 bg-blue-600 font-semibold text-white shadow-2xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Submit Appraisal Review
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Org Rating Index</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="h-4 w-4 fill-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">4.68 / 5.0</div>
            <p className="mt-1 flex items-center text-emerald-600 text-xs dark:text-emerald-400 font-medium">
              +0.12 pts vs Q2 2026
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Appraisals Completed</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">87.5%</div>
            <p className="mt-1 text-emerald-600 text-xs dark:text-emerald-400 font-medium">
              7 of 8 evaluations signed off
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Strategic OKRs On Track</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">3 of 4 OKRs</div>
            <p className="mt-1 text-muted-foreground text-xs">75% achievement probability</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Top Talent Identified</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">3 Leaders</div>
            <p className="mt-1 text-purple-600 text-xs dark:text-purple-400 font-medium">
              Eligible for executive promotion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="okrs" className="gap-2 text-xs font-semibold">
            <Target className="h-3.5 w-3.5" />
            Corporate OKRs & Goals ({okrs.length})
          </TabsTrigger>
          <TabsTrigger value="appraisals" className="gap-2 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Performance Appraisals ({appraisals.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: OKRs */}
        <TabsContent value="okrs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {okrs.map((okr) => (
              <Card key={okr.id} className="border-border/60 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="outline" className="text-[10px] font-semibold mb-1.5">
                        {okr.department}
                      </Badge>
                      <CardTitle className="font-bold text-sm text-foreground leading-snug">{okr.objective}</CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        okr.status === "Ahead"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold dark:text-emerald-400"
                          : okr.status === "On Track"
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-600 text-[11px] font-semibold dark:text-blue-400"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-600 text-[11px] font-semibold dark:text-amber-400"
                      }
                    >
                      {okr.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="font-bold text-foreground">{okr.progressPercent}% Achieved</span>
                    </div>
                    <Progress value={okr.progressPercent} className="h-2 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Target Target: {okr.dueDate}</span>
                    <span className="font-medium text-foreground">Lead: {okr.owner}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Appraisals */}
        <TabsContent value="appraisals">
          <Card className="border-border/60 shadow-xs">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold text-xs">Employee</TableHead>
                    <TableHead className="font-semibold text-xs">Reviewer</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Score</TableHead>
                    <TableHead className="font-semibold text-xs">Performance Tier</TableHead>
                    <TableHead className="font-semibold text-xs">Executive Summary</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appraisals.map((appr) => {
                    const staff = staffMap.get(appr.stafId);
                    const reviewer = staffMap.get(appr.reviewerId);
                    return (
                      <TableRow key={appr.id} className="hover:bg-muted/40">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage src={staff?.avatar} alt={staff?.nama} />
                              <AvatarFallback className="text-[10px]">
                                {staff?.nama ? getInitials(staff.nama) : "EM"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-xs text-foreground">{staff?.nama}</div>
                              <div className="text-muted-foreground text-[11px]">{staff?.jawatan}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{reviewer?.nama ?? "Leadership"}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1 font-bold text-xs text-amber-500">
                            <Star className="h-3 w-3 fill-amber-500" />
                            <span>{appr.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              appr.performanceBand === "Top Performer"
                                ? "border-purple-500/30 bg-purple-500/10 text-purple-600 text-[11px] font-semibold dark:text-purple-400"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-600 text-[11px] font-semibold dark:text-blue-400"
                            }
                          >
                            {appr.performanceBand}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-2 text-xs text-muted-foreground">{appr.feedbackSummary}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              appr.status === "Completed"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[10px] font-medium dark:text-emerald-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-600 text-[10px] font-medium dark:text-amber-400"
                            }
                          >
                            {appr.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Appraisal Dialog */}
      <Dialog open={newReviewOpen} onOpenChange={setNewReviewOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleAddReview}>
            <DialogHeader>
              <DialogTitle>Submit Performance Appraisal</DialogTitle>
              <DialogDescription>
                Record manager appraisal feedback for the Q3 2026 performance cycle.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Select Employee</Label>
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {staffData.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.nama} ({s.jawatan})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Performance Tier</Label>
                  <Select
                    value={reviewBand}
                    onValueChange={(val) => setReviewBand(val as PerformanceAppraisal["performanceBand"])}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Top Performer">Top Performer</SelectItem>
                      <SelectItem value="Exceeds Expectations">Exceeds Expectations</SelectItem>
                      <SelectItem value="Meets Expectations">Meets Expectations</SelectItem>
                      <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Numerical Score (1-5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Manager Feedback & Key Achievements</Label>
                <Textarea
                  placeholder="Detail high-impact projects, quarterly results, leadership traits, and growth goals..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="text-xs min-h-[100px]"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewReviewOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Save Appraisal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
