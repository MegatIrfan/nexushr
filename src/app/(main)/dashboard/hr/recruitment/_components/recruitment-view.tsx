"use client";

import { useId, useState } from "react";

import {
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Star,
  UserCheck,
  UserPlus,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Candidate, JobOpening } from "@/data/hr-data";
import { candidatesData as initialCandidates, jobOpeningsData as initialJobs } from "@/data/hr-data";
import { getInitials } from "@/lib/utils";

const PIPELINE_STAGES: Array<{ id: Candidate["stage"]; label: string; color: string }> = [
  { id: "Applied", label: "Applied", color: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400" },
  {
    id: "Screening",
    label: "Initial Screening",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  {
    id: "Interview",
    label: "Technical Interview",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  },
  {
    id: "Offer",
    label: "Offer Extended",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },
  {
    id: "Hired",
    label: "Hired / Onboarded",
    color: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400",
  },
];

export function RecruitmentView() {
  const [jobs, setJobs] = useState<JobOpening[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pipeline");
  const [newJobOpen, setNewJobOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Software Engineering");
  const [jobLoc, setJobLoc] = useState("Remote (Global)");
  const [jobSalary, setJobSalary] = useState("$120,000 - $150,000");

  const searchId = useId();

  const handleAdvanceStage = (candId: string) => {
    const stageOrder: Candidate["stage"][] = ["Applied", "Screening", "Interview", "Offer", "Hired"];
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candId) {
          const currentIndex = stageOrder.indexOf(c.stage);
          const nextStage = stageOrder[Math.min(currentIndex + 1, stageOrder.length - 1)];
          toast.success(`${c.name} moved to stage: ${nextStage}`);
          return { ...c, stage: nextStage };
        }
        return c;
      }),
    );
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      toast.error("Please enter a valid job title.");
      return;
    }

    const newOpening: JobOpening = {
      id: `job-${jobs.length + 1}`,
      title: jobTitle,
      department: jobDept,
      location: jobLoc,
      type: "Full-Time",
      salaryRange: jobSalary,
      openings: 1,
      applicantsCount: 0,
      status: "Active",
      postedDate: new Date().toISOString().split("T")[0],
    };

    setJobs([newOpening, ...jobs]);
    setNewJobOpen(false);
    setJobTitle("");
    toast.success("Job opening created and published to career portal!");
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(search.toLowerCase()) ||
      c.currentCompany.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">Recruitment & ATS</h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 font-semibold text-primary text-xs">
              4 Active Openings
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Applicant tracking system, candidate pipeline stages, and global requisition management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setNewJobOpen(true)}
            className="gap-1.5 bg-blue-600 font-semibold text-white shadow-2xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Job Requisition
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Total In-Flight Candidates</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">{candidates.length} Active</div>
            <p className="mt-1 flex items-center text-emerald-600 text-xs dark:text-emerald-400 font-medium">
              +14% new applications this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Avg. Time-to-Hire</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">18.5 Days</div>
            <p className="mt-1 text-emerald-600 text-xs dark:text-emerald-400 font-medium">
              -3.5 days below company benchmark
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Offer Acceptance Rate</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">88.2%</div>
            <p className="mt-1 text-muted-foreground text-xs">Top tier talent retention rate</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Live Job Postings</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Briefcase className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-extrabold text-2xl tracking-tight text-foreground">{jobs.length} Positions</div>
            <p className="mt-1 text-muted-foreground text-xs">Published across LinkedIn & Indeed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="pipeline" className="gap-2 text-xs font-semibold">
              <Users className="h-3.5 w-3.5" />
              Candidate Pipeline
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2 text-xs font-semibold">
              <Briefcase className="h-3.5 w-3.5" />
              Open Requisitions ({jobs.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id={searchId}
              placeholder="Filter candidates or roles..."
              className="pl-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tab 1: Pipeline Kanban View */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PIPELINE_STAGES.slice(0, 4).map((stage) => {
              const stageCandidates = filteredCandidates.filter((c) => c.stage === stage.id);
              return (
                <div key={stage.id} className="flex flex-col rounded-xl border bg-card/60 p-3 shadow-2xs">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-foreground">{stage.label}</span>
                      <Badge variant="outline" className={`h-5 px-1.5 text-[11px] font-bold ${stage.color}`}>
                        {stageCandidates.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Candidate Cards List */}
                  <div className="flex flex-col gap-2.5 flex-1 min-h-[300px]">
                    {stageCandidates.length === 0 ? (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                        No candidates in this stage
                      </div>
                    ) : (
                      stageCandidates.map((cand) => (
                        <div
                          key={cand.id}
                          className="rounded-lg border bg-card p-3 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={cand.avatar} alt={cand.name} />
                                <AvatarFallback className="text-[10px]">{getInitials(cand.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-xs text-foreground leading-tight">{cand.name}</h4>
                                <span className="text-[11px] text-muted-foreground">{cand.currentCompany}</span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem onClick={() => handleAdvanceStage(cand.id)}>
                                  Advance to Next Stage
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedCandidate(cand)}>
                                  View Candidate Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCandidates((prev) => prev.filter((c) => c.id !== cand.id));
                                    toast.info(`${cand.name} archived from pipeline.`);
                                  }}
                                  className="text-destructive"
                                >
                                  Reject & Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="mt-2.5 space-y-1">
                            <p className="font-medium text-[11px] text-primary truncate">{cand.appliedRole}</p>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>{cand.experienceYears}y experience</span>
                              <div className="flex items-center gap-1 font-semibold text-amber-500">
                                <Star className="h-3 w-3 fill-amber-500" />
                                <span>{cand.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t text-[10px] text-muted-foreground">
                            <span>Applied {cand.appliedDate}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdvanceStage(cand.id)}
                              className="h-6 px-2 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
                            >
                              Advance →
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Open Jobs Requisitions */}
        <TabsContent value="jobs">
          <Card className="border-border/60 shadow-xs">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold text-xs">Job Title & Department</TableHead>
                    <TableHead className="font-semibold text-xs">Location & Type</TableHead>
                    <TableHead className="font-semibold text-xs">Salary Target</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Applicants</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{job.title}</div>
                          <div className="text-muted-foreground text-xs">{job.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">{job.salaryRange}</TableCell>
                      <TableCell className="text-center font-bold text-xs text-foreground">
                        {job.applicantsCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold dark:text-emerald-400"
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Viewing job description for ${job.title}`)}
                          className="h-8 text-xs font-medium text-primary hover:bg-primary/10"
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Job Modal */}
      <Dialog open={newJobOpen} onOpenChange={setNewJobOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateJob}>
            <DialogHeader>
              <DialogTitle>Create New Job Requisition</DialogTitle>
              <DialogDescription>
                Publish a new headcount opening to internal rosters and public career boards.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-title" className="text-xs font-semibold">
                  Position Title
                </Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Senior Backend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Department</Label>
                  <Select value={jobDept} onValueChange={setJobDept}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                      <SelectItem value="People Operations">People Operations</SelectItem>
                      <SelectItem value="Product & Design">Product & Design</SelectItem>
                      <SelectItem value="Global Finance">Global Finance</SelectItem>
                      <SelectItem value="Customer Success">Customer Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Workplace Mode</Label>
                  <Select value={jobLoc} onValueChange={setJobLoc}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote (Global)">Remote (Global)</SelectItem>
                      <SelectItem value="New York (Hybrid)">New York (Hybrid)</SelectItem>
                      <SelectItem value="San Francisco (Hybrid)">San Francisco (Hybrid)</SelectItem>
                      <SelectItem value="Headquarters (Onsite)">Headquarters (Onsite)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-salary" className="text-xs font-semibold">
                  Target Annual Compensation Range
                </Label>
                <Input
                  id="job-salary"
                  placeholder="e.g. $130,000 - $160,000"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewJobOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Publish Requisition
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Candidate Profile Modal */}
      {selectedCandidate && (
        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarImage src={selectedCandidate.avatar} />
                  <AvatarFallback>{getInitials(selectedCandidate.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg font-bold">{selectedCandidate.name}</DialogTitle>
                  <DialogDescription>
                    {selectedCandidate.appliedRole} • {selectedCandidate.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 rounded-lg border bg-muted/20 p-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Current Company</span>
                  <span className="font-semibold text-foreground">{selectedCandidate.currentCompany}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Experience</span>
                  <span className="font-semibold text-foreground">{selectedCandidate.experienceYears} Years</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Interviewer Rating</span>
                  <span className="font-semibold text-amber-500">★ {selectedCandidate.rating} / 5.0</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Current Stage</span>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {selectedCandidate.stage}
                  </Badge>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedCandidate(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  handleAdvanceStage(selectedCandidate.id);
                  setSelectedCandidate(null);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Advance Candidate Stage
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
