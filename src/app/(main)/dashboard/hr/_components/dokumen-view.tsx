"use client";

import { useState } from "react";

import { cn } from "cn";
import { Download, FileText, Filter, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { JenisDokumen } from "@/data/hr-data";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

const jenisColors: Record<JenisDokumen, string> = {
  "Surat Lantikan": "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Surat Pengesahan": "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Surat Perkhidmatan": "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "Dokumen Peribadi": "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Penilaian Prestasi": "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Sijil Kursus": "border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400",
  "Lain-lain": "border-border bg-muted/50 text-muted-foreground",
};

const jenisEnglishLabels: Record<JenisDokumen, string> = {
  "Surat Lantikan": "Appointment Letter",
  "Surat Pengesahan": "Employment Confirmation",
  "Surat Perkhidmatan": "Service Records",
  "Dokumen Peribadi": "Identity & Records",
  "Penilaian Prestasi": "Performance Appraisal",
  "Sijil Kursus": "Training & Certifications",
  "Lain-lain": "General Policies",
};

const jenisIcons: Record<string, string> = {
  PDF: "📄",
  DOC: "📝",
  DOCX: "📝",
  XLS: "📊",
  XLSX: "📊",
  JPG: "🖼️",
  PNG: "🖼️",
};

export function DokumenView() {
  const currentUser = useHrAuth((s) => s.currentUser);
  const staff = useHrStore((s) => s.staff);
  const dokumen = useHrStore((s) => s.dokumen);
  const tambahDokumen = useHrStore((s) => s.tambahDokumen);
  const padamDokumen = useHrStore((s) => s.padamDokumen);

  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("All");
  const [filterStaf, setFilterStaf] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    stafId: "",
    tajuk: "",
    jenis: "Surat Lantikan" as JenisDokumen,
    formatFail: "PDF",
  });

  const isAdmin = currentUser?.role === "admin";
  const myStaf = staff.find((s) => s.email === currentUser?.email);

  // Staff can only see their own docs
  const visibleDocs = currentUser?.role === "staf" ? dokumen.filter((d) => d.stafId === myStaf?.id) : dokumen;

  const filtered = visibleDocs.filter((d) => {
    const stafItem = staff.find((s) => s.id === d.stafId);
    const q = search.toLowerCase();
    const matchSearch = d.tajuk.toLowerCase().includes(q) || (stafItem?.nama.toLowerCase().includes(q) ?? false);
    const matchJenis = filterJenis === "All" || d.jenis === filterJenis || jenisEnglishLabels[d.jenis] === filterJenis;
    const matchStaf = filterStaf === "All" || d.stafId === filterStaf;
    return matchSearch && matchJenis && matchStaf;
  });

  const handleUpload = () => {
    if (!form.stafId || !form.tajuk) {
      toast.error("Please fill in all required document details.");
      return;
    }
    tambahDokumen({
      stafId: form.stafId,
      tajuk: form.tajuk,
      jenis: form.jenis,
      tarikhDimuat: new Date().toISOString().slice(0, 10),
      saizFail: `${Math.floor(Math.random() * 500 + 100)} KB`,
      formatFail: form.formatFail,
    });
    toast.success("Document uploaded successfully.");
    setDialogOpen(false);
    setForm({ stafId: "", tajuk: "", jenis: "Surat Lantikan", formatFail: "PDF" });
  };

  const handleDownload = (tajuk: string) => {
    toast.success(`Downloading "${tajuk}"...`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">HR Documents & Files</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} corporate documents available</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setDialogOpen(true)}
            className="gap-2 self-start bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-2xs sm:self-auto"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      {/* Summary by type */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {(
          [
            "Surat Lantikan",
            "Surat Pengesahan",
            "Surat Perkhidmatan",
            "Dokumen Peribadi",
            "Lain-lain",
          ] as JenisDokumen[]
        ).map((jenis) => (
          <button
            key={jenis}
            type="button"
            className={cn(
              "rounded-xl border p-3 text-center transition-all hover:scale-[1.02] active:scale-100 shadow-2xs",
              jenisColors[jenis],
              filterJenis === jenis && "ring-2 ring-current",
            )}
            onClick={() => setFilterJenis(filterJenis === jenis ? "All" : jenis)}
          >
            <p className="font-extrabold text-xl tracking-tight">
              {visibleDocs.filter((d) => d.jenis === jenis).length}
            </p>
            <p className="mt-1 font-semibold text-xs leading-tight">{jenisEnglishLabels[jenis]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-44 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="dokumen-search"
            placeholder="Search by title or employee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card shadow-2xs"
          />
        </div>
        <Select value={filterJenis} onValueChange={setFilterJenis}>
          <SelectTrigger id="dokumen-filter-jenis" className="w-52 bg-card shadow-2xs">
            <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {["All", "Surat Lantikan", "Surat Pengesahan", "Surat Perkhidmatan", "Dokumen Peribadi", "Lain-lain"].map(
              (j) => (
                <SelectItem key={j} value={j}>
                  {j === "All" ? "All Categories" : jenisEnglishLabels[j as JenisDokumen]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        {currentUser?.role !== "staf" && (
          <Select value={filterStaf} onValueChange={setFilterStaf}>
            <SelectTrigger id="dokumen-filter-staf" className="w-52 bg-card shadow-2xs">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Employees</SelectItem>
              {staff.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered
          .sort((a, b) => b.tarikhDimuat.localeCompare(a.tarikhDimuat))
          .map((d) => {
            const stafItem = staff.find((s) => s.id === d.stafId);
            return (
              <Card key={d.id} className="group transition-all hover:border-primary/40 shadow-2xs">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
                      {jenisIcons[d.formatFail] ?? "📄"}
                    </div>
                    <Badge className={cn("shrink-0 border text-[10px] font-medium", jenisColors[d.jenis])}>
                      {jenisEnglishLabels[d.jenis]}
                    </Badge>
                  </div>
                  <div>
                    <p className="line-clamp-2 font-semibold text-sm leading-tight text-foreground">{d.tajuk}</p>
                    <p className="mt-1 text-muted-foreground text-xs">{stafItem?.nama}</p>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-xs">
                    <span>
                      {d.formatFail} · {d.saizFail}
                    </span>
                    <span>
                      {new Date(d.tarikhDimuat).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1 gap-1.5 text-xs shadow-2xs"
                      onClick={() => handleDownload(d.tajuk)}
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                    {isAdmin && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-muted-foreground hover:border-destructive/50 hover:text-destructive shadow-2xs"
                        onClick={() => setDeleteId(d.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="mb-3 h-10 w-10 opacity-30 text-blue-500" />
            <p className="font-semibold text-foreground">No documents found.</p>
            <p className="mt-1 text-xs">Try selecting another category or clear the search filter.</p>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Corporate Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="dok-staf">Assign to Employee *</Label>
              <Select value={form.stafId} onValueChange={(v) => setForm({ ...form, stafId: v })}>
                <SelectTrigger id="dok-staf">
                  <SelectValue placeholder="Select employee..." />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dok-tajuk">Document Title *</Label>
              <Input
                id="dok-tajuk"
                placeholder="e.g. Employment Agreement - Full Name"
                value={form.tajuk}
                onChange={(e) => setForm({ ...form, tajuk: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dok-jenis">Category</Label>
              <Select value={form.jenis} onValueChange={(v) => setForm({ ...form, jenis: v as JenisDokumen })}>
                <SelectTrigger id="dok-jenis">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Surat Lantikan", "Surat Pengesahan", "Surat Perkhidmatan", "Dokumen Peribadi", "Lain-lain"].map(
                    (j) => (
                      <SelectItem key={j} value={j}>
                        {jenisEnglishLabels[j as JenisDokumen]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dok-format">File Format</Label>
              <Select value={form.formatFail} onValueChange={(v) => setForm({ ...form, formatFail: v })}>
                <SelectTrigger id="dok-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["PDF", "DOC", "DOCX", "XLS", "XLSX"].map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 rounded-xl border-2 border-dashed p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Drag and drop file here, or</p>
              <Button type="button" variant="outline" size="sm">
                Browse Files
              </Button>
              <p className="text-muted-foreground text-xs">PDF, DOC, DOCX, XLS, XLSX (up to 10 MB)</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              id="btn-upload-doc"
              onClick={handleUpload}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Document Removal</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to permanently delete this document record?
          </p>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              id="btn-confirm-delete-doc"
              onClick={() => {
                if (deleteId) {
                  padamDokumen(deleteId);
                  toast.success("Document removed.");
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
