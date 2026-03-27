"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

interface Props {
  onComplete: () => void;
}

const DOMAIN = "#C4874A";

type ShapeType = "circle" | "square" | "triangle" | "diamond";
type ColorType = "red" | "blue" | "green" | "yellow";

const SHAPES: ShapeType[] = ["circle", "square", "triangle", "diamond"];
const COLORS: ColorType[] = ["red", "blue", "green", "yellow"];

const COLOR_MAP: Record<ColorType, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
};

interface Cell {
  shape: ShapeType;
  color: ColorType;
}

interface TrialConfig {
  difficulty: "easy" | "hard";
  missingCount: number;
}

const TRIAL_CONFIGS: TrialConfig[] = [
  // Easy: shape only, 3 missing
  { difficulty: "easy", missingCount: 3 },
  { difficulty: "easy", missingCount: 3 },
  { difficulty: "easy", missingCount: 3 },
  // Hard: shape + color, 2 missing
  { difficulty: "hard", missingCount: 2 },
  { difficulty: "hard", missingCount: 2 },
  { difficulty: "hard", missingCount: 2 },
  { difficulty: "hard", missingCount: 2 },
  { difficulty: "hard", missingCount: 2 },
  { difficulty: "hard", missingCount: 2 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateLatinSquare(): Cell[][] {
  // Generate a valid 4x4 Latin square for shapes and colors
  const shapePerms = [
    [0, 1, 2, 3],
    [1, 2, 3, 0],
    [2, 3, 0, 1],
    [3, 0, 1, 2],
  ];
  const colorPerms = [
    [0, 1, 2, 3],
    [2, 3, 0, 1],
    [3, 0, 1, 2],
    [1, 2, 3, 0],
  ];

  // Shuffle rows
  const rowOrder = shuffle([0, 1, 2, 3]);

  const grid: Cell[][] = [];
  for (let r = 0; r < 4; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 4; c++) {
      row.push({
        shape: SHAPES[shapePerms[rowOrder[r]][c]],
        color: COLORS[colorPerms[rowOrder[r]][c]],
      });
    }
    grid.push(row);
  }
  return grid;
}

function ShapeSVG({
  shape,
  color,
  size = 36,
}: {
  shape: ShapeType;
  color: string;
  size?: number;
}) {
  const half = size / 2;
  if (shape === "circle") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={half} cy={half} r={half - 2} fill={color} />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect x={2} y={2} width={size - 4} height={size - 4} fill={color} rx={2} />
      </svg>
    );
  }
  if (shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon points={`${half},2 ${size - 2},${size - 2} 2,${size - 2}`} fill={color} />
      </svg>
    );
  }
  // diamond
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={`${half},2 ${size - 2},${half} ${half},${size - 2} 2,${half}`} fill={color} />
    </svg>
  );
}

export default function LatinSquareTask({ onComplete }: Props) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, "correct" | "incorrect"> | null>(null);
  const [done, setDone] = useState(false);
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);
  const [answers, setAnswers] = useState<Record<string, Cell>>({});

  const config = TRIAL_CONFIGS[trialIndex];

  // Generate grid and missing cells for this trial
  const { grid, missingCells } = useMemo(() => {
    const g = generateLatinSquare();
    // Pick random cells to remove
    const allCells: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        allCells.push([r, c]);
      }
    }
    const shuffled = shuffle(allCells);
    const missing = shuffled.slice(0, config.missingCount);
    return { grid: g, missingCells: missing };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialIndex]);

  const missingKeys = useMemo(
    () => new Set(missingCells.map(([r, c]) => `${r}-${c}`)),
    [missingCells]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (feedback) return;
      const key = `${row}-${col}`;
      if (!missingKeys.has(key)) return;

      if (config.difficulty === "easy") {
        if (!selectedShape) return;
        setAnswers((prev) => ({
          ...prev,
          [key]: { shape: selectedShape, color: grid[row][col].color },
        }));
      } else {
        if (!selectedShape || !selectedColor) return;
        setAnswers((prev) => ({
          ...prev,
          [key]: { shape: selectedShape, color: selectedColor },
        }));
      }
    },
    [feedback, missingKeys, selectedShape, selectedColor, config.difficulty, grid]
  );

  const submitAnswers = useCallback(() => {
    if (Object.keys(answers).length < missingCells.length) return;

    const fb: Record<string, "correct" | "incorrect"> = {};
    let allCorrect = true;
    for (const [r, c] of missingCells) {
      const key = `${r}-${c}`;
      const answer = answers[key];
      const expected = grid[r][c];
      if (!answer) {
        fb[key] = "incorrect";
        allCorrect = false;
      } else if (
        config.difficulty === "easy"
          ? answer.shape === expected.shape
          : answer.shape === expected.shape && answer.color === expected.color
      ) {
        fb[key] = "correct";
      } else {
        fb[key] = "incorrect";
        allCorrect = false;
      }
    }

    setFeedback(fb);
    if (allCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setAnswers({});
      setSelectedShape(null);
      setSelectedColor(null);
      if (trialIndex + 1 >= TRIAL_CONFIGS.length) {
        setDone(true);
      } else {
        setTrialIndex((i) => i + 1);
      }
    }, 1200);
  }, [answers, missingCells, grid, config.difficulty, trialIndex]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 2000);
      return () => clearTimeout(t);
    }
  }, [done, onComplete]);

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-xl border border-border p-8 text-center max-w-md">
          <p className="font-display text-xl text-text-primary mb-2">
            Task Complete
          </p>
          <p className="font-body text-text-secondary">
            Correct trials: {score} / {TRIAL_CONFIGS.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-display text-2xl text-text-primary">
            Latin Square Task
          </h1>
          <span className="font-body text-sm text-text-secondary">
            Trial {trialIndex + 1} / {TRIAL_CONFIGS.length}
          </span>
        </div>
        <p className="font-body text-xs text-text-secondary mb-1">
          Difficulty: {config.difficulty === "easy" ? "Shape only" : "Shape + Color"}
        </p>
        <p className="font-body text-xs text-text-secondary mb-4">
          Each shape and {config.difficulty === "hard" ? "color " : ""}must appear exactly once per row and column.
        </p>

        {/* Progress */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(trialIndex / TRIAL_CONFIGS.length) * 100}%`,
              backgroundColor: DOMAIN,
            }}
          />
        </div>

        {/* Selection palette */}
        <div className="bg-surface rounded-xl border border-border p-4 mb-4">
          <p className="font-body text-xs text-text-secondary mb-2">
            Select a shape{config.difficulty === "hard" ? " and color" : ""}, then click an empty cell:
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            {SHAPES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedShape(s)}
                className="p-2 rounded-lg border-2 transition-all"
                style={{
                  borderColor: selectedShape === s ? DOMAIN : "#E8E6E0",
                  backgroundColor: selectedShape === s ? `${DOMAIN}11` : "transparent",
                }}
              >
                <ShapeSVG shape={s} color="#6B6B65" size={28} />
              </button>
            ))}
            {config.difficulty === "hard" && (
              <>
                <div className="w-px h-8 bg-border mx-1" />
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: COLOR_MAP[c],
                      borderColor: selectedColor === c ? "#1A1A18" : "transparent",
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="bg-surface rounded-xl border border-border p-4 mb-4">
          <div className="grid grid-cols-4 gap-2 max-w-[320px] mx-auto">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const key = `${r}-${c}`;
                const isMissing = missingKeys.has(key);
                const answer = answers[key];
                const fb = feedback?.[key];

                let borderColor = "#E8E6E0";
                let bgColor = "white";
                if (fb === "correct") {
                  borderColor = "#22c55e";
                  bgColor = "#dcfce7";
                } else if (fb === "incorrect") {
                  borderColor = "#ef4444";
                  bgColor = "#fecaca";
                } else if (isMissing) {
                  borderColor = DOMAIN;
                  bgColor = `${DOMAIN}08`;
                }

                const displayCell = isMissing ? answer : cell;
                const displayColor =
                  config.difficulty === "easy"
                    ? "#6B6B65"
                    : displayCell
                    ? COLOR_MAP[displayCell.color]
                    : "#6B6B65";

                return (
                  <button
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    disabled={!isMissing || !!feedback}
                    className="aspect-square rounded-lg border-2 flex items-center justify-center transition-all"
                    style={{ borderColor, backgroundColor: bgColor }}
                  >
                    {displayCell ? (
                      <ShapeSVG shape={displayCell.shape} color={displayColor} size={36} />
                    ) : (
                      <span className="text-text-secondary text-lg">?</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            onClick={submitAnswers}
            disabled={
              Object.keys(answers).length < missingCells.length || !!feedback
            }
            className="px-6 py-2 rounded-lg font-body text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: DOMAIN }}
          >
            Check Answers
          </button>
        </div>
      </div>
    </div>
  );
}
