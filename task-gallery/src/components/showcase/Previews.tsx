"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Meta-d' Preview: Two dot clouds fading in/out with confidence bar ───
export function MetaDprimePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawDots = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 28;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = phase === 0 || phase === 2 ? "#4A7C9E" : "#4A7C9E60";
        ctx.fill();
      }
    };

    if (phase === 0) drawDots(45, 40, 30);
    if (phase === 2) drawDots(115, 40, 38);
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} width={160} height={80} className="rounded" />
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((v) => (
          <motion.div
            key={v}
            animate={{ opacity: phase === 3 ? (v === 3 ? 1 : 0.3) : 0.15 }}
            className="w-6 h-3 rounded-sm text-[6px] flex items-center justify-center font-body text-white"
            style={{ backgroundColor: "#4A7C9E" }}
          >
            {v}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Matrix Reasoning Preview: 3×3 grid with cycling answer ───
export function MatrixReasoningPreview() {
  const [answer, setAnswer] = useState(0);
  const shapes = ["circle", "triangle", "square"];

  useEffect(() => {
    const interval = setInterval(() => setAnswer((a) => (a + 1) % 3), 1500);
    return () => clearInterval(interval);
  }, []);

  const renderShape = (shape: string, size: number, color: string) => {
    if (shape === "circle") return <circle cx={size / 2} cy={size / 2} r={size / 3} fill={color} />;
    if (shape === "triangle") return <polygon points={`${size / 2},${size / 6} ${size / 6},${size * 5 / 6} ${size * 5 / 6},${size * 5 / 6}`} fill={color} />;
    return <rect x={size / 6} y={size / 6} width={size * 2 / 3} height={size * 2 / 3} fill={color} />;
  };

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="w-7 h-7 bg-white rounded-sm border border-gray-200 flex items-center justify-center">
          {i < 8 ? (
            <svg width="20" height="20" viewBox="0 0 20 20">
              {renderShape(shapes[(i % 3)], 20, "#7B6CA8")}
            </svg>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={answer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  {renderShape(shapes[answer], 20, "#7B6CA860")}
                </svg>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Beer Game Preview: Pipeline with crates flowing ───
export function BeerGamePreview() {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPos((p) => (p + 1) % 100), 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-36 h-16 relative">
      <svg width="144" height="64" viewBox="0 0 144 64">
        <line x1="10" y1="32" x2="134" y2="32" stroke="#E8E6E0" strokeWidth="3" />
        {["Factory", "Dist.", "Whole.", "Retail"].map((label, i) => (
          <g key={label}>
            <rect x={i * 36 + 4} y="22" width="20" height="20" rx="3" fill="#7B6CA830" stroke="#7B6CA8" strokeWidth="1" />
            <text x={i * 36 + 14} y="58" textAnchor="middle" fontSize="5" fill="#6B6B65" fontFamily="sans-serif">{label}</text>
          </g>
        ))}
        {[0, 1, 2].map((i) => {
          const x = 28 + (i * 36) + (pos % 100) * 0.36;
          const wrapped = x > 134 ? x - 108 : x;
          return (
            <rect key={i} x={wrapped} y="28" width="6" height="8" rx="1" fill="#7B6CA8"
              opacity={0.7}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Complex Problem Solving Preview: Sliders with bars ───
export function ComplexProblemSolvingPreview() {
  const [values, setValues] = useState([40, 60, 30]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((v) => v.map((val) => Math.max(10, Math.min(90, val + (Math.random() - 0.5) * 20))));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 items-end h-16">
      {values.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ height: v * 0.5 }}
            transition={{ duration: 0.8 }}
            className="w-5 rounded-t"
            style={{ backgroundColor: ["#7B6CA8", "#7B6CA8AA", "#7B6CA866"][i] }}
          />
          <div className="w-5 h-0.5 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Meta-Emotion Preview: Image area with circumplex dot ───
export function MetaEmotionPreview() {
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDotPos({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-14 bg-gradient-to-br from-rose-100 to-rose-200 rounded-sm" />
      <svg width="56" height="56" viewBox="0 0 56 56">
        <rect x="0" y="0" width="56" height="56" fill="#fafaf8" stroke="#E8E6E0" rx="2" />
        <line x1="28" y1="0" x2="28" y2="56" stroke="#E8E6E020" />
        <line x1="0" y1="28" x2="56" y2="28" stroke="#E8E6E020" />
        <motion.circle
          cx={dotPos.x * 0.56}
          cy={dotPos.y * 0.56}
          animate={{ cx: dotPos.x * 0.56, cy: dotPos.y * 0.56 }}
          transition={{ duration: 1 }}
          r="3"
          fill="#B85C5C"
        />
        <text x="2" y="6" fontSize="4" fill="#6B6B65">excited</text>
        <text x="2" y="54" fontSize="4" fill="#6B6B65">calm</text>
      </svg>
    </div>
  );
}

// ─── Emotional Intelligence Preview: Face with sliders ───
export function EmotionalIntelligencePreview() {
  const [vals, setVals] = useState([3, 1, 2, 4, 2]);
  const labels = ["Happy", "Sad", "Fear", "Anger", "Surpr."];

  useEffect(() => {
    const interval = setInterval(() => {
      setVals((v) => v.map(() => 1 + Math.floor(Math.random() * 4)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-14 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center text-lg">
        &#128578;
      </div>
      <div className="flex gap-0.5">
        {vals.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              animate={{ height: v * 5 }}
              className="w-3 rounded-t"
              style={{ backgroundColor: "#B85C5C" }}
              transition={{ duration: 0.5 }}
            />
            <span className="text-[4px] text-text-secondary mt-0.5">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Category Learning Preview: Beetle with cycling features ───
export function CategoryLearningPreview() {
  const [longAnt, setLongAnt] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setLongAnt((v) => !v), 2000);
    return () => clearInterval(interval);
  }, []);

  const antLen = longAnt ? 20 : 10;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="60" height="70" viewBox="0 0 60 70">
        {/* Body */}
        <ellipse cx="30" cy="45" rx="14" ry="18" fill="#5A8C6A" opacity={0.7} />
        {/* Head */}
        <circle cx="30" cy="22" r="8" fill="#5A8C6A" opacity={0.8} />
        {/* Antennae */}
        <motion.line
          x1="26" y1="15" x2={26 - antLen * 0.6} y2={15 - antLen}
          animate={{ x2: 26 - antLen * 0.6, y2: 15 - antLen }}
          stroke="#5A8C6A" strokeWidth="1.5" transition={{ duration: 0.5 }}
        />
        <motion.line
          x1="34" y1="15" x2={34 + antLen * 0.6} y2={15 - antLen}
          animate={{ x2: 34 + antLen * 0.6, y2: 15 - antLen }}
          stroke="#5A8C6A" strokeWidth="1.5" transition={{ duration: 0.5 }}
        />
        {/* Legs */}
        {[-1, 0, 1].map((j) => (
          <g key={j}>
            <line x1="16" y1={40 + j * 8} x2="8" y2={38 + j * 8} stroke="#5A8C6A" strokeWidth="1" />
            <line x1="44" y1={40 + j * 8} x2="52" y2={38 + j * 8} stroke="#5A8C6A" strokeWidth="1" />
          </g>
        ))}
      </svg>
      <div className="flex gap-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={longAnt ? "a" : "b"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[7px] font-body font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "#5A8C6A20", color: "#5A8C6A" }}
          >
            {longAnt ? "Species A" : "Species B"}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Analogical Reasoning Preview: 2×2 matrix with cycling answer ───
export function AnalogicalReasoningPreview() {
  const [idx, setIdx] = useState(0);
  const colors = ["#7B6CA8", "#B85C5C", "#4A7C9E"];

  useEffect(() => {
    const interval = setInterval(() => setIdx((i) => (i + 1) % 3), 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-1">
      <div className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center">
        <svg width="18" height="18"><circle cx="9" cy="9" r="6" fill="#7B6CA8" /></svg>
      </div>
      <div className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center">
        <svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="#7B6CA8" /></svg>
      </div>
      <div className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center">
        <svg width="18" height="18"><rect x="3" y="3" width="12" height="12" fill="#7B6CA8" /></svg>
      </div>
      <motion.div
        className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
        animate={{ borderColor: colors[idx] + "60" }}
      >
        <AnimatePresence mode="wait">
          <motion.svg
            key={idx}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            width="18" height="18"
          >
            <rect x="3" y="3" width={10 + idx * 2} height={10 + idx * 2} fill={colors[idx]} />
          </motion.svg>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Latin Square Preview: 4×4 grid with pulsing cell ───
export function LatinSquarePreview() {
  const [active, setActive] = useState(0);
  const shapes = ["●", "■", "▲", "◆"];
  const colors = ["#EF4444", "#3B82F6", "#22C55E", "#EAB308"];
  const grid = [
    [0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, -1],
  ];

  useEffect(() => {
    const interval = setInterval(() => setActive((a) => (a + 1) % 4), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-0.5">
      {grid.flat().map((v, i) => (
        <div key={i} className="w-6 h-6 bg-white rounded-sm border border-gray-200 flex items-center justify-center">
          {v >= 0 ? (
            <span style={{ color: colors[v], fontSize: "10px" }}>{shapes[v]}</span>
          ) : (
            <motion.span
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5 }}
              style={{ color: colors[active], fontSize: "10px" }}
            >
              {shapes[active]}
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Relational Monitoring Preview: Problem text with confidence ───
export function RelationalMonitoringPreview() {
  const [conf, setConf] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => setConf((c) => ((c % 4) + 1)), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 px-2">
      <div className="text-[7px] text-text-secondary font-body text-center leading-relaxed">
        <div>A &gt; B</div>
        <div>B &gt; C</div>
        <div className="font-medium text-text-primary mt-1">Who is smallest?</div>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((v) => (
          <motion.div
            key={v}
            animate={{ opacity: v === conf ? 1 : 0.25 }}
            className="w-5 h-3 rounded-sm text-[5px] flex items-center justify-center font-body text-white"
            style={{ backgroundColor: "#4A7C9E" }}
          >
            {v}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Tower of Hanoi Preview: Auto-solving 3-disc ───
export function TowerOfHanoiPreview() {
  const moves = [
    [[2, 1, 0], [], []],
    [[2, 1], [], [0]],
    [[2], [1], [0]],
    [[2], [1, 0], []],
    [[], [1, 0], [2]],
    [[0], [1], [2]],
    [[0], [], [2, 1]],
    [[], [], [2, 1, 0]],
  ];
  const [step, setStep] = useState(0);
  const discWidths = [14, 20, 26];
  const discColors = ["#C9A84C", "#C4874A", "#B87333"];

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % moves.length), 700);
    return () => clearInterval(interval);
  }, []);

  const state = moves[step];

  return (
    <svg width="120" height="60" viewBox="0 0 120 60">
      {/* Pegs */}
      {[20, 60, 100].map((x) => (
        <line key={x} x1={x} y1="12" x2={x} y2="52" stroke="#E8E6E0" strokeWidth="2" />
      ))}
      <line x1="4" y1="52" x2="116" y2="52" stroke="#E8E6E0" strokeWidth="2" />
      {/* Discs */}
      {state.map((peg, pegIdx) =>
        peg.map((disc, discIdx) => {
          const w = discWidths[disc];
          const x = [20, 60, 100][pegIdx] - w / 2;
          const y = 48 - (discIdx + 1) * 7;
          return (
            <motion.rect
              key={`${disc}`}
              x={x}
              y={y}
              animate={{ x, y }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              width={w}
              height={6}
              rx={2}
              fill={discColors[disc]}
            />
          );
        })
      )}
    </svg>
  );
}

// ─── Task Switching Preview: Digit flipping color ───
export function TaskSwitchingPreview() {
  const [isBlue, setIsBlue] = useState(true);
  const [digit, setDigit] = useState(7);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlue((b) => !b);
      setDigit(1 + Math.floor(Math.random() * 8)); // 1-8 excluding 5
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={{ backgroundColor: isBlue ? "#3B82F6" : "#EAB308" }}
        transition={{ duration: 0.3 }}
        className="w-14 h-14 rounded-lg flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={digit}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-white text-xl font-display font-semibold"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <motion.div
        animate={{ opacity: 1 }}
        className="text-[7px] font-body font-semibold uppercase tracking-wider"
        style={{ color: isBlue ? "#3B82F6" : "#EAB308" }}
      >
        {isBlue ? "Odd / Even" : "High / Low"}
      </motion.div>
    </div>
  );
}

// ─── Preview map ───
export const PREVIEW_COMPONENTS: Record<string, React.FC> = {
  "meta-dprime": MetaDprimePreview,
  "matrix-reasoning": MatrixReasoningPreview,
  "beer-game": BeerGamePreview,
  "complex-problem-solving": ComplexProblemSolvingPreview,
  "meta-emotion": MetaEmotionPreview,
  "emotional-intelligence": EmotionalIntelligencePreview,
  "category-learning": CategoryLearningPreview,
  "analogical-reasoning": AnalogicalReasoningPreview,
  "latin-square": LatinSquarePreview,
  "relational-monitoring": RelationalMonitoringPreview,
  "tower-of-hanoi": TowerOfHanoiPreview,
  "task-switching": TaskSwitchingPreview,
};
