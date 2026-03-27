import { create } from "zustand";
import type { CognitiveDomain } from "./domain-colours";

interface ShowcaseState {
  activeFilter: CognitiveDomain | "All";
  setActiveFilter: (filter: CognitiveDomain | "All") => void;
  activeTask: string | null;
  setActiveTask: (slug: string | null) => void;
  completedTasks: Set<string>;
  markCompleted: (slug: string) => void;
}

export const useShowcaseStore = create<ShowcaseState>((set) => ({
  activeFilter: "All",
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  activeTask: null,
  setActiveTask: (slug) => set({ activeTask: slug }),
  completedTasks: new Set(),
  markCompleted: (slug) =>
    set((state) => {
      const next = new Set(state.completedTasks);
      next.add(slug);
      return { completedTasks: next };
    }),
}));
