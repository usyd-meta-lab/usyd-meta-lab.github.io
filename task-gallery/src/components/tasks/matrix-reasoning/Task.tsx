"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Shape = "circle" | "triangle" | "square";
type Fill = "empty" | "hatched" | "filled";
type Size = "small" | "medium" | "large";
type Count = 1 | 2 | 3;

interface CellAttrs {
  shape: Shape;
  fill: Fill;
  size: Size;
  count: Count;
}

type AttrKey = keyof CellAttrs;

type RuleKind = "progression" | "constant" | "distribution";

interface Rule {
  attribute: AttrKey;
  kind: RuleKind;
}

const SHAPES: Shape[] = ["circle", "triangle", "square"];
const FILLS: Fill[] = ["empty", "hatched", "filled"];
const SIZES: Size[] = ["small", "medium", "large"];
const COUNTS: Count[] = [1, 2, 3];

const ATTR_VALUES: Record<AttrKey, readonly string[] | readonly number[]> = {
  shape: SHAPES,
  fill: FILLS,
  size: SIZES,
  count: COUNTS,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  return shuffle([...arr]).slice(0, n);
}

/* ------------------------------------------------------------------ */
/*  Matrix generation                                                  */
/* ------------------------------------------------------------------ */

function generateMatrix(ruleCount: number): {
  grid: CellAttrs[][]; // 3x3, grid[row][col]
  answer: CellAttrs;
  rules: Rule[];
} {
  // Pick which attributes get rules
  const allAttrs: AttrKey[] = ["shape", "fill", "size", "count"];
  const ruleAttrs = pickN(allAttrs, ruleCount);
  const freeAttrs = allAttrs.filter((a) => !ruleAttrs.includes(a));

  const rules: Rule[] = [];
  // For each rule attribute, decide rule kind
  // We bias: constant and distribution are more common for shape/fill,
  // progression more common for size/count
  const ruleKinds: RuleKind[] = ["progression", "constant", "distribution"];

  // Build row-level values for each attribute
  // rowVals[attr][row][col] = value
  const rowVals: Record<string, unknown[][]> = {};

  for (const attr of ruleAttrs) {
    const kind = pick(ruleKinds);
    rules.push({ attribute: attr, kind });
    const vals = ATTR_VALUES[attr] as unknown[];

    if (kind === "constant") {
      // Each row has the same value (but rows may differ from each other)
      const rowConstants = [pick(vals), pick(vals), pick(vals)];
      rowVals[attr] = rowConstants.map((v) => [v, v, v]);
    } else if (kind === "distribution") {
      // Each row is a permutation of all 3 values
      rowVals[attr] = [shuffle([...vals]), shuffle([...vals]), shuffle([...vals])];
    } else {
      // progression: values go in order across columns (same order each row)
      // Pick a random starting permutation order that stays consistent per row
      const ordered = [...vals]; // already in order 0,1,2
      // Each row uses the same progression order
      rowVals[attr] = [
        [...ordered],
        [...ordered],
        [...ordered],
      ];
    }
  }

  // Free attributes: pick a single random value, constant across entire matrix
  for (const attr of freeAttrs) {
    const vals = ATTR_VALUES[attr] as unknown[];
    const v = pick(vals);
    rowVals[attr] = [
      [v, v, v],
      [v, v, v],
      [v, v, v],
    ];
  }

  // Assemble grid
  const grid: CellAttrs[][] = [];
  for (let r = 0; r < 3; r++) {
    const row: CellAttrs[] = [];
    for (let c = 0; c < 3; c++) {
      row.push({
        shape: rowVals["shape"][r][c] as Shape,
        fill: rowVals["fill"][r][c] as Fill,
        size: rowVals["size"][r][c] as Size,
        count: rowVals["count"][r][c] as Count,
      });
    }
    grid.push(row);
  }

  const answer = grid[2][2];

  return { grid, answer, rules };
}

/* ------------------------------------------------------------------ */
/*  Distractor generation                                              */
/* ------------------------------------------------------------------ */

function generateDistractors(
  answer: CellAttrs,
  rules: Rule[],
  count: number
): CellAttrs[] {
  const distractors: CellAttrs[] = [];
  const seen = new Set<string>();
  seen.add(JSON.stringify(answer));

  const allAttrs: AttrKey[] = ["shape", "fill", "size", "count"];
  const attrVals: Record<AttrKey, readonly (string | number)[]> = {
    shape: SHAPES,
    fill: FILLS,
    size: SIZES,
    count: COUNTS,
  };

  let attempts = 0;
  while (distractors.length < count && attempts < 200) {
    attempts++;
    const d = { ...answer };

    // Violate 1-2 rule attributes
    const numViolations = Math.random() < 0.5 ? 1 : Math.min(2, rules.length);
    const violateAttrs = pickN(
      rules.map((r) => r.attribute),
      numViolations
    );

    for (const attr of violateAttrs) {
      const vals = attrVals[attr].filter((v) => v !== answer[attr]);
      if (vals.length > 0) {
        (d as Record<string, unknown>)[attr] = pick(vals);
      }
    }

    // If no rules, mutate random attributes
    if (rules.length === 0) {
      const attr = pick(allAttrs);
      const vals = attrVals[attr].filter((v) => v !== answer[attr]);
      if (vals.length > 0) {
        (d as Record<string, unknown>)[attr] = pick(vals);
      }
    }

    const key = JSON.stringify(d);
    if (!seen.has(key)) {
      seen.add(key);
      distractors.push(d);
    }
  }

  // Fill remaining if needed
  while (distractors.length < count) {
    const d = {
      shape: pick(SHAPES),
      fill: pick(FILLS),
      size: pick(SIZES),
      count: pick(COUNTS),
    };
    const key = JSON.stringify(d);
    if (!seen.has(key)) {
      seen.add(key);
      distractors.push(d);
    }
  }

  return distractors;
}

/* ------------------------------------------------------------------ */
/*  SVG rendering                                                      */
/* ------------------------------------------------------------------ */

const DOMAIN_COLOR = "#7B6CA8";

function sizeToPixels(size: Size): number {
  switch (size) {
    case "small":
      return 14;
    case "medium":
      return 20;
    case "large":
      return 26;
  }
}

function renderShape(
  shape: Shape,
  fill: Fill,
  cx: number,
  cy: number,
  r: number,
  idx: number
): JSX.Element {
  const strokeColor = DOMAIN_COLOR;
  const strokeWidth = 1.8;

  let fillColor: string;
  if (fill === "filled") fillColor = DOMAIN_COLOR;
  else fillColor = "none";

  const hatchId = `hatch-${idx}-${cx}-${cy}`;

  const hatchPattern =
    fill === "hatched" ? (
      <defs key={`def-${hatchId}`}>
        <pattern
          id={hatchId}
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="4"
            stroke={DOMAIN_COLOR}
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
    ) : null;

  const useFill = fill === "hatched" ? `url(#${hatchId})` : fillColor;

  let shapeEl: JSX.Element;

  switch (shape) {
    case "circle":
      shapeEl = (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={useFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      );
      break;
    case "square": {
      const half = r * 0.9;
      shapeEl = (
        <rect
          x={cx - half}
          y={cy - half}
          width={half * 2}
          height={half * 2}
          fill={useFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      );
      break;
    }
    case "triangle": {
      const h = r * 1.1;
      const points = `${cx},${cy - h} ${cx - h},${cy + h * 0.7} ${cx + h},${cy + h * 0.7}`;
      shapeEl = (
        <polygon
          points={points}
          fill={useFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      );
      break;
    }
  }

  return (
    <g key={`shape-${idx}-${cx}-${cy}`}>
      {hatchPattern}
      {shapeEl}
    </g>
  );
}

function CellSVG({
  cell,
  size: svgSize = 80,
  id = 0,
}: {
  cell: CellAttrs;
  size?: number;
  id?: number;
}) {
  const r = sizeToPixels(cell.size);
  const mid = svgSize / 2;

  // Position shapes based on count
  const positions: [number, number][] = [];
  if (cell.count === 1) {
    positions.push([mid, mid]);
  } else if (cell.count === 2) {
    positions.push([mid - r - 2, mid]);
    positions.push([mid + r + 2, mid]);
  } else {
    // 3: triangle arrangement
    positions.push([mid, mid - r]);
    positions.push([mid - r - 2, mid + r * 0.6]);
    positions.push([mid + r + 2, mid + r * 0.6]);
  }

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className="block"
    >
      {positions.map(([cx, cy], i) =>
        renderShape(cell.shape, cell.fill, cx, cy, r, id * 10 + i)
      )}
    </svg>
  );
}

function QuestionMark({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <text
        x={size / 2}
        y={size / 2 + 8}
        textAnchor="middle"
        fontSize="32"
        fontWeight="600"
        fill="#999"
        fontFamily="inherit"
      >
        ?
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Trial type                                                         */
/* ------------------------------------------------------------------ */

interface Trial {
  grid: CellAttrs[][];
  answer: CellAttrs;
  options: CellAttrs[];
  correctIdx: number;
  rules: Rule[];
}

function buildTrial(ruleCount: number): Trial {
  const { grid, answer, rules } = generateMatrix(ruleCount);
  const distractors = generateDistractors(answer, rules, 5);

  // Insert correct answer at a random position among 6 options
  const correctIdx = Math.floor(Math.random() * 6);
  const options: CellAttrs[] = [];
  let dIdx = 0;
  for (let i = 0; i < 6; i++) {
    if (i === correctIdx) {
      options.push(answer);
    } else {
      options.push(distractors[dIdx++]);
    }
  }

  return { grid, answer, options, correctIdx, rules };
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  onComplete: () => void;
}

export default function MatrixReasoningTask({ onComplete }: Props) {
  const MAX_TRIALS = 10;
  const [trialIndex, setTrialIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [difficulty, setDifficulty] = useState(1); // number of rules
  const [feedback, setFeedback] = useState<null | { correct: boolean; idx: number }>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate trial for current index
  const trial = useMemo(() => buildTrial(difficulty), [trialIndex, difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const handleSelect = useCallback(
    (idx: number) => {
      if (feedback !== null || selected !== null) return; // already answered

      const correct = idx === trial.correctIdx;
      setSelected(idx);
      setFeedback({ correct, idx });

      const newConsec = correct ? consecutiveCorrect + 1 : 0;

      feedbackTimer.current = setTimeout(() => {
        setFeedback(null);
        setSelected(null);

        if (correct) {
          setCorrectCount((c) => c + 1);
        }
        setConsecutiveCorrect(newConsec);

        // Ramp difficulty after 3 consecutive correct
        if (newConsec >= 3 && difficulty < 3) {
          setDifficulty((d) => Math.min(d + 1, 3));
        }

        const nextTrial = trialIndex + 1;
        if (nextTrial >= MAX_TRIALS) {
          onComplete();
        } else {
          setTrialIndex(nextTrial);
        }
      }, 300);
    },
    [feedback, selected, trial, consecutiveCorrect, difficulty, trialIndex, onComplete]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="font-display text-xl font-semibold text-text-primary mb-1">
          Matrix Reasoning
        </h2>
        <p className="font-body text-sm text-text-primary/60">
          Trial {trialIndex + 1} of {MAX_TRIALS} &middot;{" "}
          {correctCount} correct &middot; Difficulty: {"★".repeat(difficulty)}{"☆".repeat(3 - difficulty)}
        </p>
      </div>

      {/* 3x3 Matrix */}
      <div
        className="grid grid-cols-3 gap-[2px] rounded-xl overflow-hidden mb-8 border-2"
        style={{ borderColor: DOMAIN_COLOR }}
      >
        {trial.grid.map((row, r) =>
          row.map((cell, c) => {
            const isMissing = r === 2 && c === 2;
            return (
              <div
                key={`${r}-${c}`}
                className="w-20 h-20 bg-white flex items-center justify-center"
                style={{
                  borderRight: c < 2 ? `1px solid #e5e5e0` : undefined,
                  borderBottom: r < 2 ? `1px solid #e5e5e0` : undefined,
                }}
              >
                {isMissing ? (
                  <QuestionMark size={80} />
                ) : (
                  <CellSVG cell={cell} size={80} id={r * 3 + c} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Instruction */}
      <p className="font-body text-sm text-text-primary/70 mb-4">
        Select the pattern that completes the matrix:
      </p>

      {/* 6 options in a 3x2 grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {trial.options.map((opt, i) => {
          let borderClass = "border-2 border-border";
          if (feedback !== null && i === trial.correctIdx) {
            borderClass = "border-2 border-green-500 ring-2 ring-green-300";
          } else if (feedback !== null && i === feedback.idx && !feedback.correct) {
            borderClass = "border-2 border-red-500 ring-2 ring-red-300";
          } else if (selected === null) {
            borderClass =
              "border-2 border-border hover:border-[#7B6CA8] cursor-pointer";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={feedback !== null}
              className={`w-20 h-20 bg-white rounded-lg flex items-center justify-center transition-all ${borderClass}`}
            >
              <CellSVG cell={opt} size={72} id={100 + i} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
