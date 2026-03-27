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
            className="flex items-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://usyd-meta-lab.github.io/images/logo.PNG"
              alt="USYD Meta Lab"
              className="h-10"
            />
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
