"use client";

import { useRouter } from "next/navigation";
import { useShowcaseStore } from "@/lib/store";
import { TASKS, GRID_ORDER } from "@/lib/task-config";
import TaskTile from "./TaskTile";

export default function ShowcaseGrid() {
  const router = useRouter();
  const activeFilter = useShowcaseStore((s) => s.activeFilter);

  const orderedTasks = GRID_ORDER.map(
    (slug) => TASKS.find((t) => t.slug === slug)!
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderedTasks.map((task, i) => {
          const isFiltered =
            activeFilter !== "All" && task.domain !== activeFilter;
          return (
            <TaskTile
              key={task.slug}
              task={task}
              index={i}
              isFiltered={isFiltered}
              onClick={() => router.push(`/tasks/${task.slug}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
