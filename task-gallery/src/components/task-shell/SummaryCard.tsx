"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DOMAIN_COLOURS } from "@/lib/domain-colours";
import type { TaskConfig } from "@/lib/task-config";

interface SummaryCardProps {
  task: TaskConfig;
  onReturn: () => void;
}

export default function SummaryCard({ task, onReturn }: SummaryCardProps) {
  const colour = DOMAIN_COLOURS[task.domain];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onReturn, 8000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onReturn]);

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onReturn();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg bg-surface rounded-xl p-8 shadow-lg border border-border"
      >
        <span
          className="inline-block rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-white mb-3"
          style={{ backgroundColor: colour }}
        >
          {task.domain}
        </span>

        <h2 className="font-display text-2xl font-semibold text-text-primary mb-4">
          {task.title}
        </h2>

        <p className="font-body text-text-primary leading-relaxed mb-4">
          {task.whatThisMeasures}
        </p>

        <div
          className="p-4 rounded-lg mb-4"
          style={{ backgroundColor: `${colour}10` }}
        >
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: colour }}
          >
            {task.summaryFact}
          </p>
        </div>

        <p className="font-body text-xs text-text-secondary mb-6">
          {task.targetPaper}
        </p>

        <button
          onClick={handleClick}
          className="w-full py-3 rounded-lg font-display text-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C9A84C" }}
        >
          Return to Demonstrations
        </button>
      </motion.div>
    </motion.div>
  );
}
