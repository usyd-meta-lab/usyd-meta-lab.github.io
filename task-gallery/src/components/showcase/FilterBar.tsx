"use client";

import { useShowcaseStore } from "@/lib/store";
import { DOMAIN_COLOURS, type CognitiveDomain } from "@/lib/domain-colours";

const FILTERS: (CognitiveDomain | "All")[] = [
  "All",
  "Metacognition",
  "Reasoning",
  "Emotion",
  "Memory & Learning",
  "Executive Function",
];

export default function FilterBar() {
  const activeFilter = useShowcaseStore((s) => s.activeFilter);
  const setActiveFilter = useShowcaseStore((s) => s.setActiveFilter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const colour =
            filter === "All" ? "#6B6B65" : DOMAIN_COLOURS[filter];
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="flex-shrink-0 snap-start rounded-full px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? colour : "transparent",
                color: isActive ? "#FFFFFF" : colour,
                border: `1.5px solid ${colour}`,
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
