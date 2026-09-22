"use client";

import { useRouter } from "next/navigation";

import { cn } from "cn";
import { BadgeCheck, Check, LogOut, ShieldCheck, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { HrRole } from "@/data/hr-data";
import { getInitials } from "@/lib/utils";
import { useHrAuth } from "@/stores/hr/auth-store";

const roleNameMap: Record<string, string> = {
  admin: "HR Administrator",
  ketua: "Team Supervisor",
  staf: "Staff Employee",
};

export function AccountSwitcher({
  users,
}: {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const router = useRouter();
  const currentUser = useHrAuth((s) => s.currentUser);
  const switchRole = useHrAuth((s) => s.switchRole);
  const logout = useHrAuth((s) => s.logout);

  const roleName = currentUser ? (roleNameMap[currentUser.role] ?? "Staff Employee") : "Staff Employee";

  const activeUser =
    users.find((u) => u.email === currentUser?.email) ??
    (currentUser
      ? {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
          role: roleName,
        }
      : users[0]);

  const handleSelectUser = (user: { email: string }) => {
    let targetRole: HrRole = "admin";
    if (user.email === "penyelia@company.com" || user.email === "supervisor@company.com") {
      targetRole = "ketua";
    } else if (user.email === "staf@company.com" || user.email === "employee@company.com") {
      targetRole = "staf";
    }
    switchRole(targetRole);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/hr/login");
  };

  if (!activeUser) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="size-8 rounded-lg ring-1 ring-border shadow-2xs">
            <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
            <AvatarFallback className="rounded-lg bg-primary/10 font-semibold text-primary text-xs">
              {getInitials(activeUser.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-64 space-y-1 rounded-xl p-1.5 shadow-lg"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-2 py-1.5 font-normal">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm leading-none text-foreground">{activeUser.name}</span>
              <span className="inline-flex items-center rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Active
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{activeUser.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Switch HR Persona
        </div>
        {users.map((user) => {
          const isSelected = user.email === activeUser.email;
          return (
            <DropdownMenuItem
              key={user.email}
              className={cn("cursor-pointer rounded-lg p-1.5", isSelected && "bg-accent/60 font-medium")}
              aria-current={isSelected ? "true" : undefined}
              onClick={() => handleSelectUser(user)}
            >
              <div className="flex w-full items-center gap-2.5">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-medium text-foreground">{user.name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{user.role}</span>
                </div>
                {isSelected && (
                  <span className="mr-1 flex size-5 items-center justify-center rounded-full text-primary">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/hr")} className="cursor-pointer gap-2 text-xs">
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
            Executive Workspace
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/hr/kakitangan")}
            className="cursor-pointer gap-2 text-xs"
          >
            <Users className="h-4 w-4 text-muted-foreground" />
            Employee Directory
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="gap-2 text-xs opacity-60">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            Role: {activeUser.role}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2 text-xs text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out of NexusHR
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
