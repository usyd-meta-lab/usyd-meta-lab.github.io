"use client";

import { motion } from "framer-motion";

interface ExitButtonProps {
  onClick: () => void;
}

export default function ExitButton({ onClick }: ExitButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0.5 }}
      whileHover={{ opacity: 1, scale: 1.05 }}
      onClick={onClick}
      className="fixed top-4 right-4 z-40 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-sm border border-border font-body text-xs font-medium text-text-secondary hover:text-text-primary transition-colors shadow-sm"
    >
      &larr; Back
    </motion.button>
  );
}
