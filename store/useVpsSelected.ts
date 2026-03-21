import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type VpsStore = {
  vps: number | null;
  saveVps: (vps: number) => void;
  removeVps: () => void;
};

export const useVpsStore = create<VpsStore>()(
  persist(
    (set) => ({
      vps: null,
      saveVps: (vps) => set({ vps }),
      removeVps: () => set({ vps: null }),
    }),
    {
      name: "vps-selected-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
