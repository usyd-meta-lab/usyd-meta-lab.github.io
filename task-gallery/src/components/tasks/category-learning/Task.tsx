"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";

/* ─── Types ─────────────────────────────────────────────────────── */

interface BeetleFeatures {
  bodyShape: "round" | "elongated";
  headSize: "large" | "small";
  antennae: "long" | "short";
  legCount: 6 | 8;
  wingPattern: "spotted" | "striped";
}

type Phase = "stimulus" | "feedback" | "confidence" | "break";

interface TrialData {
  trial: number;
  features: BeetleFeatures;
  trueSpecies: "A" | "B";
  response: "A" | "B";
  correct: boolean;
  confidence: number;
  rt: number;
}

/* ─── Constants ─────────────────────────────────────────────────── */

const TOTAL_TRIALS = 30;
const FEEDBACK_MS = 800;
const BREAK_EVERY = 10;
const DIAGNOSTIC_FEATURE: keyof BeetleFeatures = "antennae";
const DIAGNOSTIC_VALUE: BeetleFeatures["antennae"] = "long";
const RULE_VALIDITY = 0.75;

/* ─── Beetle SVG ────────────────────────────────────────────────── */

function BeetleSVG({ features }: { features: BeetleFeatures }) {
  const { bodyShape, headSize, antennae, legCount, wingPattern } = features;

  const bodyW = bodyShape === "round" ? 80 : 56;
  /* bodyH not used for ellipse ry-based rendering */
  const bodyY = bodyShape === "round" ? 130 : 115;
  const bodyRx = bodyShape === "round" ? 40 : 28;
  const bodyRy = bodyShape === "round" ? 45 : 60;

  const headR = headSize === "large" ? 28 : 18;
  const headY = bodyY - bodyRy - headR + 8;

  const antennaLen = antennae === "long" ? 55 : 28;

  const legs = legCount === 6 ? [0.25, 0.5, 0.75] : [0.15, 0.38, 0.62, 0.85];

  return (
    <svg
      viewBox="0 0 240 300"
      width="240"
      height="300"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      {/* Antennae */}
      <line
        x1={120 - 12}
        y1={headY - headR + 6}
        x2={120 - 12 - antennaLen * 0.6}
        y2={headY - headR - antennaLen * 0.8}
        stroke="#2D2416"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx={120 - 12 - antennaLen * 0.6}
        cy={headY - headR - antennaLen * 0.8}
        r="3"
        fill="#2D2416"
      />
      <line
        x1={120 + 12}
        y1={headY - headR + 6}
        x2={120 + 12 + antennaLen * 0.6}
        y2={headY - headR - antennaLen * 0.8}
        stroke="#2D2416"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx={120 + 12 + antennaLen * 0.6}
        cy={headY - headR - antennaLen * 0.8}
        r="3"
        fill="#2D2416"
      />

      {/* Legs */}
      {legs.map((frac, i) => {
        const ly = bodyY - bodyRy + frac * bodyRy * 2;
        const xSpread = bodyW * 0.55;
        const legLen = 30;
        const kneeAngle = i % 2 === 0 ? -15 : 15;
        return (
          <g key={`legs-${i}`}>
            {/* Left leg */}
            <line
              x1={120 - xSpread + 4}
              y1={ly}
              x2={120 - xSpread - legLen * 0.7}
              y2={ly + kneeAngle}
              stroke="#3D3020"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1={120 - xSpread - legLen * 0.7}
              y1={ly + kneeAngle}
              x2={120 - xSpread - legLen * 1.2}
              y2={ly + legLen * 0.5}
              stroke="#3D3020"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Right leg */}
            <line
              x1={120 + xSpread - 4}
              y1={ly}
              x2={120 + xSpread + legLen * 0.7}
              y2={ly + kneeAngle}
              stroke="#3D3020"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1={120 + xSpread + legLen * 0.7}
              y1={ly + kneeAngle}
              x2={120 + xSpread + legLen * 1.2}
              y2={ly + legLen * 0.5}
              stroke="#3D3020"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Body */}
      <ellipse
        cx={120}
        cy={bodyY}
        rx={bodyRx}
        ry={bodyRy}
        fill="#6B4423"
        stroke="#3D2B14"
        strokeWidth="2"
      />

      {/* Wing seam (center line) */}
      <line
        x1={120}
        y1={bodyY - bodyRy + 12}
        x2={120}
        y2={bodyY + bodyRy - 6}
        stroke="#3D2B14"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Wing pattern */}
      {wingPattern === "spotted" ? (
        <>
          {/* Spots on the elytra */}
          {[
            [-16, -22], [16, -22],
            [-22, 0], [22, 0],
            [-12, 20], [12, 20],
            [-18, 38], [18, 38],
          ].map(([dx, dy], i) => {
            const spotX = 120 + dx;
            const spotY = bodyY + dy;
            const withinBody =
              ((spotX - 120) / bodyRx) ** 2 + ((spotY - bodyY) / bodyRy) ** 2 < 0.85;
            return withinBody ? (
              <circle
                key={`spot-${i}`}
                cx={spotX}
                cy={spotY}
                r={4.5}
                fill="#8B6F3C"
                opacity="0.7"
              />
            ) : null;
          })}
        </>
      ) : (
        <>
          {/* Stripes across the elytra */}
          {[-0.5, -0.2, 0.1, 0.4, 0.65].map((frac, i) => {
            const sy = bodyY + frac * bodyRy;
            const halfW =
              bodyRx * Math.sqrt(Math.max(0, 1 - ((sy - bodyY) / bodyRy) ** 2)) * 0.85;
            return halfW > 4 ? (
              <line
                key={`stripe-${i}`}
                x1={120 - halfW}
                y1={sy}
                x2={120 + halfW}
                y2={sy}
                stroke="#8B6F3C"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.6"
              />
            ) : null;
          })}
        </>
      )}

      {/* Pronotum (thorax shield between head and body) */}
      <ellipse
        cx={120}
        cy={bodyY - bodyRy + 4}
        rx={bodyRx * 0.7}
        ry={12}
        fill="#5A3A1A"
        stroke="#3D2B14"
        strokeWidth="1.5"
      />

      {/* Head */}
      <circle
        cx={120}
        cy={headY}
        r={headR}
        fill="#4A3015"
        stroke="#2D2416"
        strokeWidth="2"
      />

      {/* Eyes */}
      <circle cx={120 - headR * 0.5} cy={headY - 2} r={headR * 0.22} fill="#1A1A18" />
      <circle cx={120 + headR * 0.5} cy={headY - 2} r={headR * 0.22} fill="#1A1A18" />
      <circle
        cx={120 - headR * 0.5 + 1}
        cy={headY - 3}
        r={headR * 0.1}
        fill="#FFFFFF"
        opacity="0.6"
      />
      <circle
        cx={120 + headR * 0.5 + 1}
        cy={headY - 3}
        r={headR * 0.1}
        fill="#FFFFFF"
        opacity="0.6"
      />

      {/* Mandibles */}
      <path
        d={`M${120 - 5},${headY + headR - 2} Q${120 - 10},${headY + headR + 8} ${120 - 3},${headY + headR + 6}`}
        stroke="#2D2416"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M${120 + 5},${headY + headR - 2} Q${120 + 10},${headY + headR + 8} ${120 + 3},${headY + headR + 6}`}
        stroke="#2D2416"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Body highlight / sheen */}
      <ellipse
        cx={120 - bodyRx * 0.25}
        cy={bodyY - bodyRy * 0.35}
        rx={bodyRx * 0.2}
        ry={bodyRy * 0.25}
        fill="#FFFFFF"
        opacity="0.08"
      />
    </svg>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function randomFeatures(rng: () => number): BeetleFeatures {
  return {
    bodyShape: rng() < 0.5 ? "round" : "elongated",
    headSize: rng() < 0.5 ? "large" : "small",
    antennae: rng() < 0.5 ? "long" : "short",
    legCount: rng() < 0.5 ? 6 : 8,
    wingPattern: rng() < 0.5 ? "spotted" : "striped",
  };
}

function assignSpecies(
  features: BeetleFeatures,
  rng: () => number
): "A" | "B" {
  const hasDiagnostic = features[DIAGNOSTIC_FEATURE] === DIAGNOSTIC_VALUE;
  // 75% rule validity: if diagnostic present, 75% chance Species A
  if (hasDiagnostic) {
    return rng() < RULE_VALIDITY ? "A" : "B";
  }
  return rng() < RULE_VALIDITY ? "B" : "A";
}

/** Simple seeded PRNG (mulberry32) */
function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let v = t;
    v = Math.imul(v ^ (v >>> 15), v | 1);
    v ^= v + Math.imul(v ^ (v >>> 7), v | 61);
    return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─── Main Component ────────────────────────────────────────────── */

export default function CategoryLearningTask({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("stimulus");
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [pendingResponse, setPendingResponse] = useState<"A" | "B" | null>(null);
  const [trialData, setTrialData] = useState<TrialData[]>([]);
  const stimulusShownAt = useRef<number>(Date.now());

  // Generate all trials deterministically on mount
  const trials = useMemo(() => {
    const rng = mulberry32(42);
    return Array.from({ length: TOTAL_TRIALS }, () => {
      const features = randomFeatures(rng);
      const species = assignSpecies(features, rng);
      return { features, species };
    });
  }, []);

  const currentTrial = trials[trialIndex];

  // Reset stimulus timer when trial changes
  useEffect(() => {
    if (phase === "stimulus") {
      stimulusShownAt.current = Date.now();
    }
  }, [trialIndex, phase]);

  const handleResponse = useCallback(
    (response: "A" | "B") => {
      if (phase !== "stimulus") return;
      const rt = Date.now() - stimulusShownAt.current;
      const correct = response === currentTrial.species;
      setLastCorrect(correct);
      setPendingResponse(response);

      // Show feedback
      setPhase("feedback");
      setTimeout(() => {
        setPhase("confidence");
      }, FEEDBACK_MS);

      // Store partial trial data (confidence to be added)
      setTrialData((prev) => [
        ...prev,
        {
          trial: trialIndex + 1,
          features: currentTrial.features,
          trueSpecies: currentTrial.species,
          response,
          correct,
          confidence: 0,
          rt,
        },
      ]);
    },
    [phase, currentTrial, trialIndex]
  );

  const handleConfidence = useCallback(
    (level: number) => {
      // Update last trial's confidence
      setTrialData((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          confidence: level,
        };
        return updated;
      });

      const nextIndex = trialIndex + 1;

      if (nextIndex >= TOTAL_TRIALS) {
        onComplete();
        return;
      }

      // Check for break
      if (nextIndex % BREAK_EVERY === 0) {
        setPhase("break");
      } else {
        setTrialIndex(nextIndex);
        setPhase("stimulus");
        setPendingResponse(null);
        setLastCorrect(null);
      }
    },
    [trialIndex, onComplete]
  );

  const handleContinueFromBreak = useCallback(() => {
    setTrialIndex((prev) => prev + 1);
    setPhase("stimulus");
    setPendingResponse(null);
    setLastCorrect(null);
  }, []);

  // Accuracy so far
  const correctCount = trialData.filter((t) => t.correct).length;
  const answered = trialData.length;

  /* ─── Break Screen ──────────────────────────────────────── */
  if (phase === "break") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-surface rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <h2 className="font-display text-2xl text-text-primary mb-3">
            Take a Break
          </h2>
          <p className="font-body text-text-secondary mb-2">
            You have completed {trialIndex + 1} of {TOTAL_TRIALS} trials.
          </p>
          <p className="font-body text-text-secondary mb-6">
            Accuracy so far:{" "}
            <span className="font-semibold text-domain-memory">
              {answered > 0 ? Math.round((correctCount / answered) * 100) : 0}%
            </span>
          </p>
          <p className="font-body text-text-secondary text-sm mb-8">
            Press continue when you are ready.
          </p>
          <button
            onClick={handleContinueFromBreak}
            className="px-8 py-3 rounded-lg bg-domain-memory text-white font-body font-medium
                       hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ─── Main Trial Screen ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Trial counter */}
      <div className="mb-4 text-center">
        <span className="font-body text-sm text-text-secondary">
          Trial{" "}
          <span className="font-semibold text-text-primary">
            {trialIndex + 1}
          </span>{" "}
          / {TOTAL_TRIALS}
        </span>
        {answered > 0 && (
          <span className="font-body text-sm text-text-secondary ml-4">
            Accuracy:{" "}
            <span className="font-semibold text-domain-memory">
              {Math.round((correctCount / answered) * 100)}%
            </span>
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-1.5 bg-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-domain-memory rounded-full transition-all duration-300"
          style={{ width: `${((trialIndex + 1) / TOTAL_TRIALS) * 100}%` }}
        />
      </div>

      {/* Beetle card */}
      <div className="bg-surface rounded-2xl shadow-md p-8 mb-6 w-full max-w-sm">
        <BeetleSVG features={currentTrial.features} />

        {/* Feature labels for clarity */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            currentTrial.features.bodyShape === "round"
              ? "Round body"
              : "Elongated body",
            currentTrial.features.headSize === "large"
              ? "Large head"
              : "Small head",
            currentTrial.features.antennae === "long"
              ? "Long antennae"
              : "Short antennae",
            `${currentTrial.features.legCount} legs`,
            currentTrial.features.wingPattern === "spotted"
              ? "Spotted wings"
              : "Striped wings",
          ].map((label) => (
            <span
              key={label}
              className="text-xs font-body text-text-secondary bg-background
                         px-2 py-0.5 rounded-full border border-border"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Feedback overlay */}
      {phase === "feedback" && lastCorrect !== null && (
        <div className="mb-4 h-8 flex items-center justify-center">
          {lastCorrect ? (
            <span className="font-body font-semibold text-lg text-green-600">
              Correct &#10003;
            </span>
          ) : (
            <span className="font-body font-semibold text-lg text-red-500">
              Incorrect &#10007;
            </span>
          )}
        </div>
      )}

      {/* Confidence rating */}
      {phase === "confidence" && (
        <div className="mb-4 text-center">
          <p className="font-body text-sm text-text-secondary mb-3">
            How confident are you in your answer?
          </p>
          <div className="flex gap-3 justify-center">
            {[
              { value: 1, label: "Guess" },
              { value: 2, label: "Low" },
              { value: 3, label: "Medium" },
              { value: 4, label: "Certain" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleConfidence(value)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg border border-border
                           bg-surface hover:border-domain-memory hover:bg-green-50
                           transition-colors font-body"
              >
                <span className="text-sm font-semibold text-text-primary">
                  {value}
                </span>
                <span className="text-xs text-text-secondary">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Response buttons */}
      {phase === "stimulus" && (
        <div className="flex gap-4">
          <button
            onClick={() => handleResponse("A")}
            className="px-8 py-3 rounded-lg bg-domain-memory text-white font-body font-medium
                       hover:opacity-90 transition-opacity min-w-[140px]"
          >
            Species A
          </button>
          <button
            onClick={() => handleResponse("B")}
            className="px-8 py-3 rounded-lg bg-white text-text-primary font-body font-medium
                       border-2 border-domain-memory hover:bg-green-50
                       transition-colors min-w-[140px]"
          >
            Species B
          </button>
        </div>
      )}

      {/* Spacer so feedback/confidence don't shift layout */}
      {phase === "stimulus" && <div className="h-8 mb-4" />}
      {phase === "feedback" && (
        <div className="flex gap-4 opacity-50 pointer-events-none">
          <button
            className={`px-8 py-3 rounded-lg font-body font-medium min-w-[140px] ${
              pendingResponse === "A"
                ? "bg-domain-memory text-white ring-2 ring-offset-2 ring-domain-memory"
                : "bg-white text-text-primary border-2 border-domain-memory"
            }`}
          >
            Species A
          </button>
          <button
            className={`px-8 py-3 rounded-lg font-body font-medium min-w-[140px] ${
              pendingResponse === "B"
                ? "bg-domain-memory text-white ring-2 ring-offset-2 ring-domain-memory"
                : "bg-white text-text-primary border-2 border-domain-memory"
            }`}
          >
            Species B
          </button>
        </div>
      )}
    </div>
  );
}
