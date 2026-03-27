"use client";

import { motion } from "framer-motion";
import { DOMAIN_COLOURS } from "@/lib/domain-colours";
import type { TaskConfig } from "@/lib/task-config";

interface InstructionScreenProps {
  task: TaskConfig;
  onStart: () => void;
  onBack: () => void;
}

export default function InstructionScreen({
  task,
  onStart,
  onBack,
}: InstructionScreenProps) {
  const colour = DOMAIN_COLOURS[task.domain];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[560px] bg-surface rounded-xl p-8 shadow-sm border border-border"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-block rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-white mb-4"
          style={{ backgroundColor: colour }}
        >
          {task.domain}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display text-3xl font-semibold text-text-primary mb-4"
        >
          {task.title}
        </motion.h1>

        <motion.ul className="space-y-3 mb-6">
          {task.instructionBullets.map((bullet, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="flex gap-3 font-body text-[17px] leading-relaxed text-text-primary"
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white mt-0.5"
                style={{ backgroundColor: colour }}
              >
                {i + 1}
              </span>
              {bullet}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-4 rounded-lg bg-background"
        >
          <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
            What this measures
          </h3>
          <p className="font-body text-sm text-text-primary leading-relaxed">
            {task.whatThisMeasures}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="font-body text-sm text-text-secondary mb-6"
        >
          This demo takes approximately {task.demoGuidanceMinutes} minutes
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onStart}
          className="w-full py-3 rounded-lg font-display text-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C9A84C" }}
        >
          Begin Task
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          onClick={onBack}
          className="w-full mt-3 py-2 font-body text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          &larr; Return to Demonstrations
        </motion.button>
      </motion.div>
    </div>
  );
}
