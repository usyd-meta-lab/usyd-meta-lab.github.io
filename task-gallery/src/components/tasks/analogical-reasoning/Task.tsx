"use client";

import { useState, useCallback, useEffect } from "react";

interface Props {
  onComplete: () => void;
}

const DOMAIN = "#7B6CA8";

// Part A: Verbal analogies
interface VerbalTrial {
  type: "verbal";
  a: string;
  b: string;
  c: string;
  options: string[];
  correctIndex: number;
  difficulty: "easy" | "hard";
}

// Part B: Geometric analogies
interface GeoTransform {
  rotation?: number;
  colorChange?: string;
  sizeChange?: "grow" | "shrink";
}

interface GeoTrial {
  type: "geometric";
  baseShape: "circle" | "square" | "triangle";
  baseColor: string;
  baseSize: number;
  transform: GeoTransform;
  cShape: "circle" | "square" | "triangle";
  cColor: string;
  cSize: number;
  options: { shape: "circle" | "square" | "triangle"; color: string; size: number; rotation: number }[];
  correctIndex: number;
}

type Trial = VerbalTrial | GeoTrial;

const VERBAL_TRIALS: VerbalTrial[] = [
  { type: "verbal", a: "Hot", b: "Cold", c: "Bright", options: ["Light", "Dark", "Sun", "Warm"], correctIndex: 1, difficulty: "easy" },
  { type: "verbal", a: "Book", b: "Library", c: "Car", options: ["Road", "Garage", "Driver", "Engine"], correctIndex: 1, difficulty: "easy" },
  { type: "verbal", a: "Painter", b: "Canvas", c: "Writer", options: ["Book", "Pen", "Paper", "Ink"], correctIndex: 2, difficulty: "easy" },
  { type: "verbal", a: "Fish", b: "Water", c: "Bird", options: ["Wing", "Air", "Nest", "Fly"], correctIndex: 1, difficulty: "easy" },
  { type: "verbal", a: "Scalpel", b: "Surgeon", c: "Gavel", options: ["Courtroom", "Law", "Judge", "Trial"], correctIndex: 2, difficulty: "hard" },
  { type: "verbal", a: "Archipelago", b: "Island", c: "Constellation", options: ["Galaxy", "Star", "Night", "Telescope"], correctIndex: 1, difficulty: "hard" },
  { type: "verbal", a: "Prologue", b: "Novel", c: "Overture", options: ["Melody", "Opera", "Conductor", "Stage"], correctIndex: 1, difficulty: "hard" },
  { type: "verbal", a: "Chrysalis", b: "Butterfly", c: "Cocoon", options: ["Silk", "Moth", "Caterpillar", "Web"], correctIndex: 1, difficulty: "hard" },
];

const GEO_TRIALS: GeoTrial[] = [
  {
    type: "geometric",
    baseShape: "circle", baseColor: "#4A7C9E", baseSize: 40,
    transform: { rotation: 0, colorChange: "#B85C5C" },
    cShape: "square", cColor: "#4A7C9E", cSize: 40,
    options: [
      { shape: "square", color: "#B85C5C", size: 40, rotation: 0 },
      { shape: "square", color: "#4A7C9E", size: 30, rotation: 0 },
      { shape: "circle", color: "#B85C5C", size: 40, rotation: 0 },
      { shape: "triangle", color: "#B85C5C", size: 40, rotation: 0 },
    ],
    correctIndex: 0,
  },
  {
    type: "geometric",
    baseShape: "square", baseColor: "#5A8C6A", baseSize: 35,
    transform: { sizeChange: "grow" },
    cShape: "triangle", cColor: "#5A8C6A", cSize: 35,
    options: [
      { shape: "triangle", color: "#5A8C6A", size: 25, rotation: 0 },
      { shape: "triangle", color: "#5A8C6A", size: 50, rotation: 0 },
      { shape: "square", color: "#5A8C6A", size: 50, rotation: 0 },
      { shape: "triangle", color: "#B85C5C", size: 50, rotation: 0 },
    ],
    correctIndex: 1,
  },
  {
    type: "geometric",
    baseShape: "triangle", baseColor: "#C4874A", baseSize: 40,
    transform: { rotation: 90 },
    cShape: "square", cColor: "#C4874A", cSize: 40,
    options: [
      { shape: "square", color: "#C4874A", size: 40, rotation: 90 },
      { shape: "square", color: "#C4874A", size: 40, rotation: 0 },
      { shape: "triangle", color: "#C4874A", size: 40, rotation: 90 },
      { shape: "square", color: "#7B6CA8", size: 40, rotation: 90 },
    ],
    correctIndex: 0,
  },
  {
    type: "geometric",
    baseShape: "circle", baseColor: "#7B6CA8", baseSize: 45,
    transform: { sizeChange: "shrink", colorChange: "#C4874A" },
    cShape: "circle", cColor: "#4A7C9E", cSize: 45,
    options: [
      { shape: "circle", color: "#C4874A", size: 30, rotation: 0 },
      { shape: "circle", color: "#4A7C9E", size: 30, rotation: 0 },
      { shape: "square", color: "#4A7C9E", size: 30, rotation: 0 },
      { shape: "circle", color: "#4A7C9E", size: 45, rotation: 0 },
    ],
    correctIndex: 1,
  },
  {
    type: "geometric",
    baseShape: "square", baseColor: "#B85C5C", baseSize: 35,
    transform: { rotation: 45, colorChange: "#5A8C6A" },
    cShape: "triangle", cColor: "#B85C5C", cSize: 40,
    options: [
      { shape: "triangle", color: "#5A8C6A", size: 40, rotation: 45 },
      { shape: "triangle", color: "#B85C5C", size: 40, rotation: 45 },
      { shape: "square", color: "#5A8C6A", size: 40, rotation: 45 },
      { shape: "triangle", color: "#5A8C6A", size: 30, rotation: 0 },
    ],
    correctIndex: 0,
  },
  {
    type: "geometric",
    baseShape: "triangle", baseColor: "#4A7C9E", baseSize: 30,
    transform: { sizeChange: "grow", rotation: 180 },
    cShape: "circle", cColor: "#4A7C9E", cSize: 30,
    options: [
      { shape: "circle", color: "#4A7C9E", size: 45, rotation: 0 },
      { shape: "circle", color: "#4A7C9E", size: 30, rotation: 180 },
      { shape: "triangle", color: "#4A7C9E", size: 45, rotation: 180 },
      { shape: "circle", color: "#B85C5C", size: 45, rotation: 0 },
    ],
    correctIndex: 0,
  },
];

const ALL_TRIALS: Trial[] = [...VERBAL_TRIALS, ...GEO_TRIALS];

function ShapeSVG({
  shape,
  color,
  size,
  rotation = 0,
  cx = 50,
  cy = 50,
}: {
  shape: "circle" | "square" | "triangle";
  color: string;
  size: number;
  rotation?: number;
  cx?: number;
  cy?: number;
}) {
  const transform = `rotate(${rotation} ${cx} ${cy})`;
  if (shape === "circle") {
    return <circle cx={cx} cy={cy} r={size / 2} fill={color} transform={transform} />;
  }
  if (shape === "square") {
    const half = size / 2;
    return (
      <rect
        x={cx - half}
        y={cy - half}
        width={size}
        height={size}
        fill={color}
        transform={transform}
      />
    );
  }
  // triangle
  const half = size / 2;
  const points = `${cx},${cy - half} ${cx - half},${cy + half} ${cx + half},${cy + half}`;
  return <polygon points={points} fill={color} transform={transform} />;
}

export default function AnalogicalReasoningTask({ onComplete }: Props) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = ALL_TRIALS[trialIndex];

  const handleAnswer = useCallback(
    (index: number) => {
      if (feedback) return;
      setSelected(index);
      const correct = index === current.correctIndex;
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        if (trialIndex + 1 >= ALL_TRIALS.length) {
          setDone(true);
        } else {
          setTrialIndex((i) => i + 1);
        }
      }, 500);
    },
    [feedback, current, trialIndex]
  );

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
            Score: {score} / {ALL_TRIALS.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-display text-2xl text-text-primary">
            Analogical Reasoning
          </h1>
          <span className="font-body text-sm text-text-secondary">
            {trialIndex + 1} / {ALL_TRIALS.length}
          </span>
        </div>
        <p className="font-body text-xs text-text-secondary mb-4">
          {current.type === "verbal" ? "Part A: Verbal Analogies" : "Part B: Geometric Analogies"}
          {current.type === "verbal" && ` (${(current as VerbalTrial).difficulty})`}
        </p>

        {/* Progress */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(trialIndex / ALL_TRIALS.length) * 100}%`,
              backgroundColor: DOMAIN,
            }}
          />
        </div>

        {/* Feedback flash */}
        {feedback && (
          <div
            className="mb-4 text-center py-2 rounded-lg font-body text-sm"
            style={{
              backgroundColor: feedback === "correct" ? "#dcfce7" : "#fecaca",
              color: feedback === "correct" ? "#166534" : "#991b1b",
            }}
          >
            {feedback === "correct" ? "Correct!" : "Incorrect"}
          </div>
        )}

        {current.type === "verbal" && (
          <div className="bg-surface rounded-xl border border-border p-6">
            <p className="font-display text-lg text-text-primary text-center mb-6">
              <span style={{ color: DOMAIN }}>{current.a}</span> :{" "}
              <span style={{ color: DOMAIN }}>{current.b}</span> :: {current.c} : ?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {current.options.map((opt, i) => {
                let bg = "transparent";
                let border = "#E8E6E0";
                if (feedback && selected === i) {
                  bg = feedback === "correct" ? "#dcfce7" : "#fecaca";
                  border = feedback === "correct" ? "#22c55e" : "#ef4444";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={!!feedback}
                    className="px-4 py-3 rounded-lg border font-body text-text-primary transition-all hover:border-gray-400"
                    style={{ backgroundColor: bg, borderColor: border }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {current.type === "geometric" && (() => {
          const geo = current as GeoTrial;
          // Apply transform to A to get B
          const bColor = geo.transform.colorChange || geo.baseColor;
          const bSize = geo.transform.sizeChange === "grow" ? geo.baseSize * 1.4 : geo.transform.sizeChange === "shrink" ? geo.baseSize * 0.7 : geo.baseSize;
          const bRotation = geo.transform.rotation || 0;

          return (
            <div className="bg-surface rounded-xl border border-border p-6">
              <p className="font-body text-sm text-text-secondary mb-4 text-center">
                Find the shape that completes the pattern.
              </p>
              {/* 2x2 matrix */}
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-[300px] mx-auto">
                {/* A */}
                <div className="border border-border rounded-lg aspect-square flex items-center justify-center bg-gray-50">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <ShapeSVG shape={geo.baseShape} color={geo.baseColor} size={geo.baseSize} />
                  </svg>
                </div>
                {/* B */}
                <div className="border border-border rounded-lg aspect-square flex items-center justify-center bg-gray-50">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <ShapeSVG shape={geo.baseShape} color={bColor} size={bSize} rotation={bRotation} />
                  </svg>
                </div>
                {/* C */}
                <div className="border border-border rounded-lg aspect-square flex items-center justify-center bg-gray-50">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <ShapeSVG shape={geo.cShape} color={geo.cColor} size={geo.cSize} />
                  </svg>
                </div>
                {/* ? */}
                <div
                  className="border-2 rounded-lg aspect-square flex items-center justify-center"
                  style={{ borderColor: DOMAIN, borderStyle: "dashed" }}
                >
                  <span className="font-display text-2xl" style={{ color: DOMAIN }}>
                    ?
                  </span>
                </div>
              </div>
              {/* Options */}
              <div className="grid grid-cols-4 gap-3">
                {geo.options.map((opt, i) => {
                  let border = "#E8E6E0";
                  let bg = "white";
                  if (feedback && selected === i) {
                    bg = feedback === "correct" ? "#dcfce7" : "#fecaca";
                    border = feedback === "correct" ? "#22c55e" : "#ef4444";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={!!feedback}
                      className="border rounded-lg aspect-square flex items-center justify-center transition-all hover:border-gray-400"
                      style={{ borderColor: border, backgroundColor: bg }}
                    >
                      <svg width="60" height="60" viewBox="0 0 100 100">
                        <ShapeSVG
                          shape={opt.shape}
                          color={opt.color}
                          size={opt.size}
                          rotation={opt.rotation}
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
