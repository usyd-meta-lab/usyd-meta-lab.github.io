"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Disc = number; // 1 = smallest, n = largest
type Peg = Disc[];
type Phase = "playing" | "autoSolving" | "completed";

interface GameState {
  pegs: [Peg, Peg, Peg];
  numDiscs: number;
  moves: number;
  optimalMoves: number;
  selectedPeg: number | null;
  phase: Phase;
  invalidPeg: number | null; // for shake animation
  warning: string | null;
  hintMove: { from: number; to: number } | null;
  showHintButton: boolean;
  level: number; // 1 = 3-disc, 2 = 4-disc
  startTime: number;
  elapsed: number; // seconds
  demoTimerReached: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const GUIDANCE_TIME = 360; // 6 minutes in seconds
const DISC_COLORS = [
  "#C9A84C", // accent-gold
  "#C4874A", // domain-executive
  "#D4A056",
  "#B87A3E",
  "#E0B86E",
  "#A86830",
  "#D69E4C",
];

function initPegs(n: number): [Peg, Peg, Peg] {
  const first: Peg = [];
  for (let i = n; i >= 1; i--) first.push(i);
  return [first, [], []];
}

function optimalFor(n: number) {
  return Math.pow(2, n) - 1;
}

function clonePegs(pegs: [Peg, Peg, Peg]): [Peg, Peg, Peg] {
  return [pegs[0].slice(), pegs[1].slice(), pegs[2].slice()];
}

function isSolved(pegs: [Peg, Peg, Peg], n: number): boolean {
  return pegs[2].length === n;
}

/** Iterative Tower of Hanoi solver — returns list of [from, to] moves. */
function solveHanoi(
  n: number,
  pegs: [Peg, Peg, Peg]
): Array<[number, number]> {
  // Use recursive approach with the current state
  const moves: Array<[number, number]> = [];
  const work = clonePegs(pegs);

  function recurse(disc: number, source: number, target: number, aux: number) {
    if (disc === 0) return;
    // find where disc currently is
    let discPeg = -1;
    for (let p = 0; p < 3; p++) {
      if (work[p].includes(disc)) {
        discPeg = p;
        break;
      }
    }
    if (discPeg === target) {
      // disc already in place, solve smaller
      recurse(disc - 1, source, target, aux);
      return;
    }
    // move all smaller discs out of the way
    const other = 3 - discPeg - target;
    recurse(disc - 1, discPeg, other, target);
    // move disc to target
    const idx = work[discPeg].indexOf(disc);
    work[discPeg].splice(idx, 1);
    work[target].push(disc);
    moves.push([discPeg, target]);
    // move smaller discs to target
    recurse(disc - 1, other, target, discPeg);
  }

  recurse(n, 0, 2, 1);
  return moves;
}

/** Get a single best next move from current state. */
function getHint(
  n: number,
  pegs: [Peg, Peg, Peg]
): { from: number; to: number } | null {
  const solution = solveHanoi(n, pegs);
  if (solution.length === 0) return null;
  return { from: solution[0][0], to: solution[0][1] };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TowerOfHanoiTask({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [game, setGame] = useState<GameState>(() => {
    const n = 3;
    return {
      pegs: initPegs(n),
      numDiscs: n,
      moves: 0,
      optimalMoves: optimalFor(n),
      selectedPeg: null,
      phase: "playing",
      invalidPeg: null,
      warning: null,
      hintMove: null,
      showHintButton: false,
      level: 1,
      startTime: Date.now(),
      elapsed: 0,
      demoTimerReached: false,
    };
  });

  const autoSolveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  /* Inject shake keyframes */
  useEffect(() => {
    const id = "tower-of-hanoi-shake-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes toh-shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  /* Timer tick */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setGame((prev) => {
        if (prev.phase === "completed") return prev;
        const elapsed = Math.floor((Date.now() - prev.startTime) / 1000);
        return { ...prev, elapsed };
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* Check guidance timer */
  useEffect(() => {
    if (
      game.elapsed >= GUIDANCE_TIME &&
      game.phase === "playing" &&
      !game.demoTimerReached
    ) {
      setGame((prev) => ({
        ...prev,
        phase: "autoSolving",
        demoTimerReached: true,
        warning: "Demo time reached — auto-solving...",
      }));
    }
  }, [game.elapsed, game.phase, game.demoTimerReached]);

  /* Check for level completion */
  useEffect(() => {
    if (game.phase !== "playing") return;
    if (isSolved(game.pegs, game.numDiscs)) {
      if (game.level === 1) {
        // advance to 4-disc if solved reasonably quickly (within 2x optimal + some slack)
        const n = 4;
        setGame((prev) => ({
          ...prev,
          pegs: initPegs(n),
          numDiscs: n,
          moves: 0,
          optimalMoves: optimalFor(n),
          selectedPeg: null,
          level: 2,
          hintMove: null,
          showHintButton: false,
          warning: "Great job! Now try 4 discs.",
        }));
        setTimeout(() => {
          setGame((prev) => ({ ...prev, warning: null }));
        }, 2500);
      } else {
        // Level 2 done
        setGame((prev) => ({
          ...prev,
          phase: "completed",
          warning: null,
        }));
        setTimeout(() => {
          onCompleteRef.current();
        }, 1500);
      }
    }
  }, [game.pegs, game.phase, game.level, game.numDiscs]);

  /* Auto-solve animation */
  useEffect(() => {
    if (game.phase !== "autoSolving") return;

    const solution = solveHanoi(game.numDiscs, game.pegs);
    if (solution.length === 0) {
      setGame((prev) => ({ ...prev, phase: "completed" }));
      setTimeout(() => onCompleteRef.current(), 1000);
      return;
    }

    let step = 0;
    function doStep() {
      if (step >= solution.length) {
        setGame((prev) => ({ ...prev, phase: "completed", warning: null }));
        setTimeout(() => onCompleteRef.current(), 1000);
        return;
      }
      const [from, to] = solution[step];
      setGame((prev) => {
        const pegs = clonePegs(prev.pegs);
        const disc = pegs[from].pop();
        if (disc !== undefined) pegs[to].push(disc);
        return { ...prev, pegs, moves: prev.moves + 1 };
      });
      step++;
      autoSolveRef.current = setTimeout(doStep, 500);
    }

    autoSolveRef.current = setTimeout(doStep, 600);

    return () => {
      if (autoSolveRef.current) clearTimeout(autoSolveRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.phase]);

  /* Show hint button after 3x optimal */
  useEffect(() => {
    if (game.moves > game.optimalMoves * 3 && !game.showHintButton) {
      setGame((prev) => ({ ...prev, showHintButton: true }));
    }
  }, [game.moves, game.optimalMoves, game.showHintButton]);

  /* Clear warning after delay */
  useEffect(() => {
    if (
      game.warning &&
      game.warning !== "Demo time reached — auto-solving..." &&
      game.warning !== "Great job! Now try 4 discs."
    ) {
      const t = setTimeout(() => {
        setGame((prev) => ({ ...prev, warning: null }));
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [game.warning]);

  /* Clear shake animation */
  useEffect(() => {
    if (game.invalidPeg !== null) {
      const t = setTimeout(() => {
        setGame((prev) => ({ ...prev, invalidPeg: null }));
      }, 500);
      return () => clearTimeout(t);
    }
  }, [game.invalidPeg]);

  /* ---- Handlers ---- */

  const handlePegClick = useCallback(
    (pegIndex: number) => {
      if (game.phase !== "playing") return;

      setGame((prev) => {
        if (prev.selectedPeg === null) {
          // Select source peg
          if (prev.pegs[pegIndex].length === 0) {
            return {
              ...prev,
              invalidPeg: pegIndex,
              warning: "No discs on this peg.",
            };
          }
          return { ...prev, selectedPeg: pegIndex, hintMove: null };
        }

        // Same peg — deselect
        if (prev.selectedPeg === pegIndex) {
          return { ...prev, selectedPeg: null };
        }

        // Attempt move
        const from = prev.selectedPeg;
        const to = pegIndex;
        const pegs = clonePegs(prev.pegs);
        const disc = pegs[from][pegs[from].length - 1];

        if (
          pegs[to].length > 0 &&
          pegs[to][pegs[to].length - 1] < disc
        ) {
          // Invalid move
          return {
            ...prev,
            selectedPeg: null,
            invalidPeg: to,
            warning: "Cannot place a larger disc on a smaller one.",
          };
        }

        pegs[from].pop();
        pegs[to].push(disc);

        return {
          ...prev,
          pegs,
          moves: prev.moves + 1,
          selectedPeg: null,
          hintMove: null,
          warning: null,
        };
      });
    },
    [game.phase]
  );

  const handleHint = useCallback(() => {
    const hint = getHint(game.numDiscs, game.pegs);
    if (hint) {
      setGame((prev) => ({ ...prev, hintMove: hint }));
      setTimeout(() => {
        setGame((prev) => ({ ...prev, hintMove: null }));
      }, 3000);
    }
  }, [game.numDiscs, game.pegs]);

  /* ---- Rendering helpers ---- */

  const maxDiscWidth = 160;
  const minDiscWidth = 50;
  const discHeight = 28;
  const pegHeight = game.numDiscs * (discHeight + 4) + 40;

  function discWidth(disc: number) {
    const range = maxDiscWidth - minDiscWidth;
    return minDiscWidth + (disc / game.numDiscs) * range;
  }

  function discColor(disc: number) {
    return DISC_COLORS[(disc - 1) % DISC_COLORS.length];
  }

  /* ------------------------------------------------------------------ */
  /*  JSX                                                                */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-[520px] flex flex-col items-center bg-background text-text-primary px-4 py-6 select-none">
      {/* Header */}
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-1 text-center">
        Tower of Hanoi
      </h2>
      <p className="font-body text-text-secondary text-sm mb-4 text-center max-w-md">
        Move all discs from the first peg to the last.
        {game.level === 1
          ? " Start with 3 discs."
          : " Now solve with 4 discs!"}
      </p>

      {/* Stats bar */}
      <div className="flex items-center gap-6 mb-4 font-body text-sm">
        <div className="flex flex-col items-center">
          <span className="text-text-secondary text-xs uppercase tracking-wider">
            Moves
          </span>
          <span className="text-xl font-semibold tabular-nums text-accent-gold">
            {game.moves}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-text-secondary text-xs uppercase tracking-wider">
            Optimal
          </span>
          <span className="text-xl font-semibold tabular-nums text-domain-executive">
            {game.optimalMoves}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-text-secondary text-xs uppercase tracking-wider">
            Time
          </span>
          <span className="text-xl font-semibold tabular-nums">
            {formatTime(game.elapsed)}
          </span>
        </div>
        {game.showHintButton && game.phase === "playing" && (
          <button
            onClick={handleHint}
            className="ml-2 w-9 h-9 rounded-full border-2 border-accent-gold text-accent-gold
                       flex items-center justify-center text-lg font-display font-bold
                       hover:bg-accent-gold/10 transition-colors"
            aria-label="Get a hint"
            title="Show hint"
          >
            ?
          </button>
        )}
      </div>

      {/* Warning / status */}
      <div className="h-6 mb-2 flex items-center justify-center">
        {game.warning && (
          <span
            className="font-body text-sm px-3 py-0.5 rounded-full animate-pulse"
            style={{
              backgroundColor:
                game.warning === "Great job! Now try 4 discs."
                  ? "#C9A84C22"
                  : "#C4874A22",
              color:
                game.warning === "Great job! Now try 4 discs."
                  ? "#C9A84C"
                  : "#C4874A",
            }}
          >
            {game.warning}
          </span>
        )}
        {game.phase === "completed" && !game.warning && (
          <span className="font-body text-sm text-accent-gold font-semibold">
            Puzzle complete!
          </span>
        )}
      </div>

      {/* Hint indicator */}
      {game.hintMove && (
        <div className="font-body text-xs text-accent-gold mb-2 animate-pulse">
          Hint: move top disc from Peg {game.hintMove.from + 1} to Peg{" "}
          {game.hintMove.to + 1}
        </div>
      )}

      {/* Pegs area */}
      <div className="flex items-end justify-center gap-4 md:gap-8 w-full max-w-2xl">
        {game.pegs.map((peg, pegIdx) => {
          const isSelected = game.selectedPeg === pegIdx;
          const isHintFrom = game.hintMove?.from === pegIdx;
          const isHintTo = game.hintMove?.to === pegIdx;
          const isInvalid = game.invalidPeg === pegIdx;

          return (
            <button
              key={pegIdx}
              onClick={() => handlePegClick(pegIdx)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handlePegClick(pegIdx);
              }}
              className={`
                relative flex flex-col items-center justify-end
                cursor-pointer rounded-lg transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold
                ${isSelected ? "bg-accent-gold/10 ring-2 ring-accent-gold/40" : "hover:bg-accent-gold/5"}
                ${isHintFrom ? "ring-2 ring-accent-gold ring-offset-2" : ""}
                ${isHintTo ? "ring-2 ring-domain-executive ring-offset-2" : ""}
              `}
              style={{
                width: maxDiscWidth + 32,
                height: pegHeight + 20,
                padding: "8px 8px 0 8px",
                animation: isInvalid ? "toh-shake 0.4s ease-in-out" : "none",
              }}
              aria-label={`Peg ${pegIdx + 1}${
                peg.length > 0
                  ? `, ${peg.length} disc${peg.length > 1 ? "s" : ""}`
                  : ", empty"
              }${isSelected ? ", selected" : ""}`}
            >
              {/* Peg rod */}
              <div
                className="absolute bottom-3 rounded-full"
                style={{
                  width: 8,
                  height: pegHeight - 8,
                  background:
                    "linear-gradient(to bottom, #D4C4A0, #B8A880)",
                }}
              />

              {/* Base */}
              <div
                className="absolute bottom-1 rounded-md"
                style={{
                  width: maxDiscWidth + 16,
                  height: 8,
                  background:
                    "linear-gradient(to bottom, #C8B888, #A89868)",
                }}
              />

              {/* Discs */}
              <div
                className="relative flex flex-col-reverse items-center z-10"
                style={{ marginBottom: 8 }}
              >
                {peg.map((disc, discIdx) => {
                  const w = discWidth(disc);
                  const isTop = discIdx === peg.length - 1;
                  const shouldLift = isSelected && isTop;

                  return (
                    <div
                      key={disc}
                      className="rounded-lg shadow-md transition-all duration-300 ease-in-out"
                      style={{
                        width: w,
                        height: discHeight,
                        marginBottom: 2,
                        background: `linear-gradient(135deg, ${discColor(disc)}, ${discColor(disc)}CC)`,
                        border: `2px solid ${discColor(disc)}88`,
                        transform: shouldLift
                          ? "translateY(-16px) scale(1.04)"
                          : "translateY(0) scale(1)",
                        boxShadow: shouldLift
                          ? `0 8px 20px ${discColor(disc)}44`
                          : `0 2px 4px rgba(0,0,0,0.15)`,
                        zIndex: discIdx + 1,
                      }}
                    >
                      {/* Inner shine */}
                      <div
                        className="w-full h-full rounded-md"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Peg label */}
              <span
                className="absolute -bottom-5 font-body text-xs text-text-secondary"
              >
                {pegIdx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <p className="font-body text-xs text-text-secondary mt-8 text-center max-w-sm">
        Tap a peg to select its top disc, then tap another peg to move it.
        Only smaller discs may be placed on larger ones.
      </p>

    </div>
  );
}
