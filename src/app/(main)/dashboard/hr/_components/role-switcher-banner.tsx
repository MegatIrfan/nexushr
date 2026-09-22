"use client";

import { Check, Shield, User, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import type { HrRole } from "@/data/hr-data";
import { useHrAuth } from "@/stores/hr/auth-store";

export function RoleSwitcherBanner() {
  const currentUser = useHrAuth((s) => s.currentUser);
  const switchRole = useHrAuth((s) => s.switchRole);

  const roles: { role: HrRole; label: string; email: string; name: string; icon: typeof Shield }[] = [
    {
      role: "admin",
      label: "HR Administrator",
      email: "admin@company.com",
      name: "Rohani Ahmad",
      icon: Shield,
    },
    {
      role: "ketua",
      label: "Team Supervisor",
      email: "penyelia@company.com",
      name: "Farizal Othman",
      icon: UserCheck,
    },
    {
      role: "staf",
      label: "Employee Self-Service",
      email: "staf@company.com",
      name: "Nurul Ain",
      icon: User,
    },
  ];

  const handleSwitch = (role: HrRole, label: string) => {
    switchRole(role);
    toast.success(`Switched role preview to ${label}!`);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card/60 p-3 shadow-xs backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
          Role Simulation
        </Badge>
        <span className="hidden text-muted-foreground text-xs md:inline">
          Switch user role to preview tailored permissions and operational interfaces:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {roles.map((r) => {
          const isActive = currentUser?.role === r.role;
          const Icon = r.icon;
          return (
            <button
              key={r.role}
              type="button"
              onClick={() => handleSwitch(r.role, r.label)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-xs transition-all ${
                isActive
                  ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{r.label}</span>
              {isActive && <Check className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
