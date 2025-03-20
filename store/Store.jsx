import { create } from "zustand";

export const useUserStore = create((set) => ({
  username: "",
  setUsername: (name) => set({ username: name }),
}));
