"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";

import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

import type { BakiCuti, DokumenHR, PermohonanCuti, RekorKehadiran, Staf, StatusCuti } from "@/data/hr-data";
import { bakiCutiData, dokumenData, kehadiranData, permohonanCutiData, staffData } from "@/data/hr-data";

// ─── State & Actions ──────────────────────────────────────────────────────────

interface HrState {
  staff: Staf[];
  kehadiran: RekorKehadiran[];
  permohonanCuti: PermohonanCuti[];
  bakiCuti: BakiCuti[];
  dokumen: DokumenHR[];
}

interface HrActions {
  // Staff
  tambahStaf: (staf: Omit<Staf, "id">) => void;
  kemaskiniStaf: (id: string, data: Partial<Staf>) => void;
  padamStaf: (id: string) => void;

  // Kehadiran
  checkIn: (stafId: string, tarikh: string, lokasi?: string) => void;
  checkOut: (stafId: string, tarikh: string) => void;

  // Cuti
  mohonCuti: (permohonan: Omit<PermohonanCuti, "id" | "status" | "catatanPelulus">) => void;
  lulusCuti: (id: string, catatanPelulus: string, pelulusId: string) => void;
  tolakCuti: (id: string, catatanPelulus: string, pelulusId: string) => void;
  batalCuti: (id: string) => void;

  // Dokumen
  tambahDokumen: (dok: Omit<DokumenHR, "id">) => void;
  padamDokumen: (id: string) => void;
}

type HrStore = HrState & HrActions;

// ─── Store Creator ────────────────────────────────────────────────────────────

const createHrStore = () =>
  createStore<HrStore>()(
    persist(
      (set) => ({
        staff: staffData,
        kehadiran: kehadiranData,
        permohonanCuti: permohonanCutiData,
        bakiCuti: bakiCutiData,
        dokumen: dokumenData,

        tambahStaf: (staf) =>
          set((state) => ({
            staff: [...state.staff, { ...staf, id: `s-${Date.now()}` }],
          })),

        kemaskiniStaf: (id, data) =>
          set((state) => ({
            staff: state.staff.map((s) => (s.id === id ? { ...s, ...data } : s)),
          })),

        padamStaf: (id) =>
          set((state) => ({
            staff: state.staff.filter((s) => s.id !== id),
          })),

        checkIn: (stafId, tarikh, lokasi) =>
          set((state) => {
            const existing = state.kehadiran.find((k) => k.stafId === stafId && k.tarikh === tarikh);
            const status =
              lokasi === "WFH"
                ? ("WFH" as const)
                : lokasi === "Keluar Pejabat"
                  ? ("Keluar Pejabat" as const)
                  : ("Hadir" as const);
            if (existing) {
              return {
                kehadiran: state.kehadiran.map((k) =>
                  k.stafId === stafId && k.tarikh === tarikh
                    ? { ...k, waktuMasuk: new Date().toTimeString().slice(0, 5), status, lokasi }
                    : k,
                ),
              };
            }
            return {
              kehadiran: [
                ...state.kehadiran,
                {
                  id: `k-${Date.now()}`,
                  stafId,
                  tarikh,
                  waktuMasuk: new Date().toTimeString().slice(0, 5),
                  waktuKeluar: null,
                  status,
                  sebab: "",
                  lokasi,
                },
              ],
            };
          }),

        checkOut: (stafId, tarikh) =>
          set((state) => ({
            kehadiran: state.kehadiran.map((k) =>
              k.stafId === stafId && k.tarikh === tarikh
                ? { ...k, waktuKeluar: new Date().toTimeString().slice(0, 5) }
                : k,
            ),
          })),

        mohonCuti: (permohonan) =>
          set((state) => ({
            permohonanCuti: [
              ...state.permohonanCuti,
              {
                ...permohonan,
                id: `c-${Date.now()}`,
                status: "Menunggu" as StatusCuti,
                catatanPelulus: "",
              },
            ],
          })),

        lulusCuti: (id, catatanPelulus, pelulusId) =>
          set((state) => ({
            permohonanCuti: state.permohonanCuti.map((c) =>
              c.id === id ? { ...c, status: "Diluluskan" as StatusCuti, catatanPelulus, pelulusId } : c,
            ),
          })),

        tolakCuti: (id, catatanPelulus, pelulusId) =>
          set((state) => ({
            permohonanCuti: state.permohonanCuti.map((c) =>
              c.id === id ? { ...c, status: "Ditolak" as StatusCuti, catatanPelulus, pelulusId } : c,
            ),
          })),

        batalCuti: (id) =>
          set((state) => ({
            permohonanCuti: state.permohonanCuti.map((c) =>
              c.id === id ? { ...c, status: "Dibatalkan" as StatusCuti } : c,
            ),
          })),

        tambahDokumen: (dok) =>
          set((state) => ({
            dokumen: [...state.dokumen, { ...dok, id: `d-${Date.now()}` }],
          })),

        padamDokumen: (id) =>
          set((state) => ({
            dokumen: state.dokumen.filter((d) => d.id !== id),
          })),
      }),
      {
        name: "hr-data-store",
      },
    ),
  );

// ─── Context ──────────────────────────────────────────────────────────────────

type HrStoreApi = ReturnType<typeof createHrStore>;
const HrContext = createContext<HrStoreApi | null>(null);

export function HrProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<HrStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createHrStore();
  }
  return <HrContext value={storeRef.current}>{children}</HrContext>;
}

export function useHrStore<T>(selector: (state: HrStore) => T): T {
  const store = useContext(HrContext);
  if (!store) {
    throw new Error("useHrStore must be used inside HrProvider");
  }
  return useStore(store, selector);
}
