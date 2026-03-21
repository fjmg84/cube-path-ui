import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ApiKeyStore = {
  apiKey: string;
  saveApiKey: (apiKey: string) => void;
  removeApiKey: () => void;
};

export const useApiKeyStore = create<ApiKeyStore>()(
  persist(
    (set) => ({
      apiKey: "",
      saveApiKey: (apiKey) => set({ apiKey }),
      removeApiKey: () => set({ apiKey: "" }),
    }),
    {
      name: "api-key-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
