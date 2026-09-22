"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";

import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

import type { HrAuthUser, HrRole } from "@/data/hr-data";
import { hrAuthUsers } from "@/data/hr-data";

// ─── State & Actions ─────────────────────────────────────────────────────────

interface HrAuthState {
  currentUser: HrAuthUser | null;
  isAuthenticated: boolean;
}

interface HrAuthActions {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: HrRole) => void;
  hasRole: (roles: HrRole[]) => boolean;
}

type HrAuthStore = HrAuthState & HrAuthActions;

// ─── Store Creator ────────────────────────────────────────────────────────────

const createHrAuthStore = () =>
  createStore<HrAuthStore>()(
    persist(
      (set, get) => ({
        currentUser: hrAuthUsers[0] ?? null,
        isAuthenticated: true,

        login: (email, password) => {
          const user = hrAuthUsers.find((u) => u.email === email && u.password === password);
          if (user) {
            set({ currentUser: user, isAuthenticated: true });
            return true;
          }
          return false;
        },

        logout: () => {
          set({ currentUser: null, isAuthenticated: false });
        },

        switchRole: (role) => {
          const user = hrAuthUsers.find((u) => u.role === role);
          if (user) {
            set({ currentUser: user, isAuthenticated: true });
          }
        },

        hasRole: (roles) => {
          const { currentUser } = get();
          if (!currentUser) return false;
          return roles.includes(currentUser.role);
        },
      }),
      {
        name: "hr-auth-store",
      },
    ),
  );

// ─── Context ──────────────────────────────────────────────────────────────────

type HrAuthStoreApi = ReturnType<typeof createHrAuthStore>;
const HrAuthContext = createContext<HrAuthStoreApi | null>(null);

export function HrAuthProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<HrAuthStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createHrAuthStore();
  }
  return <HrAuthContext value={storeRef.current}>{children}</HrAuthContext>;
}

export function useHrAuth<T>(selector: (state: HrAuthStore) => T): T {
  const store = useContext(HrAuthContext);
  if (!store) {
    throw new Error("useHrAuth must be used inside HrAuthProvider");
  }
  return useStore(store, selector);
}
