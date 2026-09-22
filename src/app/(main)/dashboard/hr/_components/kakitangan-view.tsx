"use client";

import { useState } from "react";

import { cn } from "cn";
import { ChevronDown, ChevronUp, Edit, Filter, MoreHorizontal, PlusCircle, Search, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import type { Staf, StatusPerkhidmatan } from "@/data/hr-data";
import { getInitials } from "@/lib/utils";
import { useHrAuth } from "@/stores/hr/auth-store";
import { useHrStore } from "@/stores/hr/hr-store";

const statusColors: Record<StatusPerkhidmatan, string> = {
  Aktif: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Bersara: "border-border bg-muted/50 text-muted-foreground",
  "Tamat Kontrak": "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Cuti Tanpa Gaji": "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

const statusEnglishLabels: Record<string, string> = {
  Aktif: "Active",
  Bersara: "Retired",
  "Tamat Kontrak": "Contract Ended",
  "Cuti Tanpa Gaji": "Unpaid Leave",
};

const emptyForm: Omit<Staf, "id"> = {
  noStaf: "",
  nama: "",
  email: "",
  telefon: "",
  jawatan: "",
  gred: "",
  bahagian: "",
  unit: "",
  tarikhMula: "",
  statusPerkhidmatan: "Aktif",
  avatar: "",
  pengurus: "",
};

type SortField = "nama" | "jawatan" | "tarikhMula";

function SortIcon({ field, currentSort, isAsc }: { field: SortField; currentSort: SortField; isAsc: boolean }) {
  if (currentSort !== field) return null;
  return isAsc ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />;
}

export function KakitanganView() {
  const role = useHrAuth((s) => s.currentUser?.role);
  const staff = useHrStore((s) => s.staff);
  const tambahStaf = useHrStore((s) => s.tambahStaf);
  const kemaskiniStaf = useHrStore((s) => s.kemaskiniStaf);
  const padamStaf = useHrStore((s) => s.padamStaf);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBahagian, setFilterBahagian] = useState("All");
  const [sortBy, setSortBy] = useState<"nama" | "jawatan" | "tarikhMula">("nama");
  const [sortAsc, setSortAsc] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaf, setEditingStaf] = useState<Staf | null>(null);
  const [form, setForm] = useState<Omit<Staf, "id">>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const bahagianList = ["All", ...Array.from(new Set(staff.map((s) => s.bahagian)))];

  const filtered = staff
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.nama.toLowerCase().includes(q) ||
        s.noStaf.toLowerCase().includes(q) ||
        s.jawatan.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      const mappedStatus = statusEnglishLabels[s.statusPerkhidmatan] ?? s.statusPerkhidmatan;
      const matchStatus =
        filterStatus === "All" || mappedStatus === filterStatus || s.statusPerkhidmatan === filterStatus;
      const matchBahagian = filterBahagian === "All" || s.bahagian === filterBahagian;
      return matchSearch && matchStatus && matchBahagian;
    })
    .sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const openAdd = () => {
    setEditingStaf(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (staf: Staf) => {
    setEditingStaf(staf);
    const { id, ...rest } = staf;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nama || !form.noStaf || !form.jawatan) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (editingStaf) {
      kemaskiniStaf(editingStaf.id, form);
      toast.success("Employee record updated successfully.");
    } else {
      tambahStaf(form);
      toast.success("New employee added to workforce.");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    padamStaf(id);
    setDeleteConfirm(null);
    toast.success("Employee record removed.");
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortAsc(!sortAsc);
    else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const isAdmin = role === "admin";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight text-foreground sm:text-3xl">
            Employee Directory & Workforce
          </h1>
          <p className="text-muted-foreground text-sm">{filtered.length} personnel records found</p>
        </div>
        {isAdmin && (
          <Button
            onClick={openAdd}
            className="gap-2 self-start bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-2xs sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="staff-search"
            placeholder="Search by name, ID, position, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card shadow-2xs"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger id="staff-filter-status" className="w-44 bg-card shadow-2xs">
            <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {["All", "Active", "Retired", "Contract Ended", "Unpaid Leave"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterBahagian} onValueChange={setFilterBahagian}>
          <SelectTrigger id="staff-filter-bahagian" className="w-52 bg-card shadow-2xs">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {bahagianList.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
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
                  <th className="whitespace-nowrap px-4 py-3.5 text-left font-semibold text-muted-foreground">
                    <button
                      type="button"
                      className="flex items-center transition-colors hover:text-foreground"
                      onClick={() => toggleSort("nama")}
                    >
                      Employee <SortIcon field="nama" currentSort={sortBy} isAsc={sortAsc} />
                    </button>
                  </th>
                  <th className="hidden whitespace-nowrap px-4 py-3.5 text-left font-semibold text-muted-foreground md:table-cell">
                    Staff ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-left font-semibold text-muted-foreground">
                    <button
                      type="button"
                      className="flex items-center transition-colors hover:text-foreground"
                      onClick={() => toggleSort("jawatan")}
                    >
                      Role & Grade <SortIcon field="jawatan" currentSort={sortBy} isAsc={sortAsc} />
                    </button>
                  </th>
                  <th className="hidden whitespace-nowrap px-4 py-3.5 text-left font-semibold text-muted-foreground lg:table-cell">
                    Department / Unit
                  </th>
                  <th className="hidden whitespace-nowrap px-4 py-3.5 text-left font-semibold text-muted-foreground lg:table-cell">
                    <button
                      type="button"
                      className="flex items-center transition-colors hover:text-foreground"
                      onClick={() => toggleSort("tarikhMula")}
                    >
                      Join Date <SortIcon field="tarikhMula" currentSort={sortBy} isAsc={sortAsc} />
                    </button>
                  </th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-left font-semibold text-muted-foreground">
                    Status
                  </th>
                  {isAdmin && <th className="px-4 py-3.5" />}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0 border">
                          <AvatarFallback className="text-xs font-semibold">{getInitials(s.nama)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold leading-tight text-foreground">{s.nama}</p>
                          <p className="text-muted-foreground text-xs">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3.5 font-mono text-muted-foreground text-xs md:table-cell">
                      {s.noStaf}
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-semibold leading-tight text-foreground">{s.jawatan}</p>
                        <p className="text-muted-foreground text-xs">Level {s.gred}</p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3.5 lg:table-cell">
                      <div>
                        <p className="leading-tight text-foreground">{s.bahagian}</p>
                        <p className="text-muted-foreground text-xs">{s.unit}</p>
                      </div>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-muted-foreground text-xs lg:table-cell">
                      {new Date(s.tarikhMula).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={cn("border text-xs font-medium", statusColors[s.statusPerkhidmatan])}>
                        {statusEnglishLabels[s.statusPerkhidmatan] ?? s.statusPerkhidmatan}
                      </Badge>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(s)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteConfirm(s.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove Employee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <User className="mx-auto mb-2 h-8 w-8 opacity-30" />
                      <p>No matching employee records found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStaf ? "Edit Employee Profile" : "Add New Employee"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="form-nostaf">Staff ID *</Label>
              <Input
                id="form-nostaf"
                placeholder="HR/000/2026"
                value={form.noStaf}
                onChange={(e) => setForm({ ...form, noStaf: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-nama">Full Legal Name *</Label>
              <Input
                id="form-nama"
                placeholder="e.g. John Doe"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-email">Work Email *</Label>
              <Input
                id="form-email"
                type="email"
                placeholder="john.doe@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-telefon">Contact Phone</Label>
              <Input
                id="form-telefon"
                placeholder="+1 (555) 000-0000"
                value={form.telefon}
                onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-jawatan">Designation / Role *</Label>
              <Input
                id="form-jawatan"
                placeholder="e.g. Senior Software Engineer"
                value={form.jawatan}
                onChange={(e) => setForm({ ...form, jawatan: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-gred">Level / Grade</Label>
              <Input
                id="form-gred"
                placeholder="e.g. L4 / M41"
                value={form.gred}
                onChange={(e) => setForm({ ...form, gred: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-bahagian">Department</Label>
              <Input
                id="form-bahagian"
                placeholder="e.g. Engineering & Technology"
                value={form.bahagian}
                onChange={(e) => setForm({ ...form, bahagian: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-unit">Unit / Team</Label>
              <Input
                id="form-unit"
                placeholder="e.g. Platform Infrastructure"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-tarikhMula">Start Date</Label>
              <Input
                id="form-tarikhMula"
                type="date"
                value={form.tarikhMula}
                onChange={(e) => setForm({ ...form, tarikhMula: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-status">Employment Status</Label>
              <Select
                value={form.statusPerkhidmatan}
                onValueChange={(v) => setForm({ ...form, statusPerkhidmatan: v as StatusPerkhidmatan })}
              >
                <SelectTrigger id="form-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Active</SelectItem>
                  <SelectItem value="Bersara">Retired</SelectItem>
                  <SelectItem value="Tamat Kontrak">Contract Ended</SelectItem>
                  <SelectItem value="Cuti Tanpa Gaji">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button id="btn-save-staff" onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
              {editingStaf ? "Save Changes" : "Create Record"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to permanently remove this employee record from the directory? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              id="btn-confirm-delete"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Confirm Removal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
