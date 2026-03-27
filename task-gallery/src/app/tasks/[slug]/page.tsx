"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { getTaskBySlug } from "@/lib/task-config";
import InstructionScreen from "@/components/task-shell/InstructionScreen";
import SummaryCard from "@/components/task-shell/SummaryCard";
import ExitButton from "@/components/task-shell/ExitButton";
import { useShowcaseStore } from "@/lib/store";

import MetaDprimeTask from "@/components/tasks/meta-dprime/Task";
import MatrixReasoningTask from "@/components/tasks/matrix-reasoning/Task";
import BeerGameTask from "@/components/tasks/beer-game/Task";
import ComplexProblemSolvingTask from "@/components/tasks/complex-problem-solving/Task";
import MetaEmotionTask from "@/components/tasks/meta-emotion/Task";
import EmotionalIntelligenceTask from "@/components/tasks/emotional-intelligence/Task";
import CategoryLearningTask from "@/components/tasks/category-learning/Task";
import AnalogicalReasoningTask from "@/components/tasks/analogical-reasoning/Task";
import LatinSquareTask from "@/components/tasks/latin-square/Task";
import RelationalMonitoringTask from "@/components/tasks/relational-monitoring/Task";
import TowerOfHanoiTask from "@/components/tasks/tower-of-hanoi/Task";
import TaskSwitchingTask from "@/components/tasks/task-switching/Task";

const TASK_COMPONENTS: Record<string, React.FC<{ onComplete: () => void }>> = {
  "meta-dprime": MetaDprimeTask,
  "matrix-reasoning": MatrixReasoningTask,
  "beer-game": BeerGameTask,
  "complex-problem-solving": ComplexProblemSolvingTask,
  "meta-emotion": MetaEmotionTask,
  "emotional-intelligence": EmotionalIntelligenceTask,
  "category-learning": CategoryLearningTask,
  "analogical-reasoning": AnalogicalReasoningTask,
  "latin-square": LatinSquareTask,
  "relational-monitoring": RelationalMonitoringTask,
  "tower-of-hanoi": TowerOfHanoiTask,
  "task-switching": TaskSwitchingTask,
};

type Phase = "instruction" | "task" | "summary";

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const task = getTaskBySlug(slug);
  const [phase, setPhase] = useState<Phase>("instruction");
  const markCompleted = useShowcaseStore((s) => s.markCompleted);

  const handleReturn = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleComplete = useCallback(() => {
    markCompleted(slug);
    setPhase("summary");
  }, [markCompleted, slug]);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-text-secondary">Task not found.</p>
      </div>
    );
  }

  const TaskComponent = TASK_COMPONENTS[slug];

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {phase === "instruction" && (
          <InstructionScreen
            key="instruction"
            task={task}
            onStart={() => setPhase("task")}
            onBack={handleReturn}
          />
        )}

        {phase === "task" && TaskComponent && (
          <div key="task">
            <ExitButton onClick={handleComplete} />
            <TaskComponent onComplete={handleComplete} />
          </div>
        )}

        {phase === "summary" && (
          <SummaryCard
            key="summary"
            task={task}
            onReturn={handleReturn}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
