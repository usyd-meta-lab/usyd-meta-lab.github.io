"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a
            href="https://usyd-meta-lab.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-text-primary no-underline transition-opacity hover:opacity-70"
          >
            <span className="w-9 h-9 flex-shrink-0" aria-hidden="true">
              <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%">
                <path d="M28 62 Q14 60 14 46 Q14 34 24 30 Q24 18 36 18 Q40 12 50 14 Q60 12 64 18 Q76 18 76 30 Q86 34 86 46 Q86 60 72 62 Q68 70 60 70 Q54 74 50 72 Q46 74 40 70 Q32 70 28 62Z" stroke="#2b180a" strokeWidth="2.6" fill="none" strokeLinejoin="round"/>
                <path d="M30 44 Q36 38 36 48 Q36 54 30 56" stroke="#6b5a4a" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.45"/>
                <path d="M70 44 Q64 38 64 48 Q64 54 70 56" stroke="#6b5a4a" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.45"/>
                <path d="M50 16 Q50 28 50 42" stroke="#6b5a4a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28"/>
                <path d="M40 40 Q45 34 50 40 Q55 34 60 40" stroke="#2b180a" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65"/>
                <path d="M42 50 Q50 56 58 50" stroke="#2b180a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
                <path d="M50 34 Q50 40 50 50" stroke="#6b5a4a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.35"/>
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1.25rem", fontWeight: 700, color: "#1A1A18" }}>
                Meta Lab
              </span>
              <span style={{ fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6B65", marginTop: "2px" }}>
                University of Sydney
              </span>
            </span>
          </a>
          <h1 className="font-display text-2xl font-semibold text-text-primary tracking-wide">
            Research Demonstrations
          </h1>
          <button
            onClick={() => setAboutOpen(true)}
            className="font-body text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            About
          </button>
        </div>
      </header>

      <AnimatePresence>
        {aboutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={() => setAboutOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-80 bg-surface shadow-xl p-8 flex flex-col"
            >
              <button
                onClick={() => setAboutOpen(false)}
                className="self-end text-text-secondary hover:text-text-primary mb-6 text-lg"
              >
                &times;
              </button>
              <h2 className="font-display text-2xl font-semibold mb-4">
                USYD Meta Lab
              </h2>
              <p className="font-body text-text-secondary leading-relaxed mb-4">
                The Meta Lab at the University of Sydney investigates metacognition,
                self-regulation, and higher-order cognition. We develop novel
                experimental paradigms and computational models to understand how
                people monitor and control their own thinking.
              </p>
              <a
                href="https://usyd-meta-lab.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-gold font-body font-medium hover:underline"
              >
                Visit our main site &rarr;
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
