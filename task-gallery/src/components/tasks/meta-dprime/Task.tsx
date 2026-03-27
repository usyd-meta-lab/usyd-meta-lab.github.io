"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  onComplete: () => void;
}

type Phase =
  | "fixation"
  | "frame1"
  | "isi"
  | "frame2"
  | "response"
  | "confidence"
  | "iti";

interface TrialData {
  trialNumber: number;
  delta: number;
  referenceCount: number;
  targetCount: number;
  targetInterval: 1 | 2;
  response: 1 | 2 | null;
  correct: boolean | null;
  confidence: number | null;
  rt: number | null;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_TRIALS = 30;
const BASE_DOT_COUNT = 50;
const STARTING_DELTA = 10;
const STEP_FACTOR = 1.25;
const MIN_DELTA = 1;
const MAX_DELTA = 40;
const DOT_RADIUS = 3;
const CLOUD_RADIUS = 100; // 200px diameter circle

const FIXATION_MS = 500;
const FRAME_MS = 250;
const ISI_MS = 300;
const ITI_MS = 400;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateDotPositions(count: number, cloudRadius: number): [number, number][] {
  const positions: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    // Uniform distribution within a circle using rejection sampling
    let x: number, y: number;
    do {
      x = (Math.random() * 2 - 1) * cloudRadius;
      y = (Math.random() * 2 - 1) * cloudRadius;
    } while (x * x + y * y > cloudRadius * cloudRadius);
    positions.push([x, y]);
  }
  return positions;
}

function drawDots(
  ctx: CanvasRenderingContext2D,
  positions: [number, number][],
  canvasWidth: number,
  canvasHeight: number
) {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw boundary circle (subtle)
  ctx.beginPath();
  ctx.arc(cx, cy, CLOUD_RADIUS, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw dots
  ctx.fillStyle = "#1A1A18";
  for (const [x, y] of positions) {
    ctx.beginPath();
    ctx.arc(cx + x, cy + y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFixation(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = "#1A1A18";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy);
  ctx.lineTo(cx + 12, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx, cy + 12);
  ctx.stroke();
}

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MetaDPrimeTask({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseStartRef = useRef<number>(0);

  const [phase, setPhase] = useState<Phase>("fixation");
  const [trialNumber, setTrialNumber] = useState(1);
  const [delta, setDelta] = useState(STARTING_DELTA);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [currentTrial, setCurrentTrial] = useState<TrialData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [results, setResults] = useState<TrialData[]>([]);
  const [finished, setFinished] = useState(false);

  // Refs for mutable trial data that doesn't need re-renders
  const trialRef = useRef<{
    targetInterval: 1 | 2;
    referenceCount: number;
    targetCount: number;
    frame1Dots: [number, number][];
    frame2Dots: [number, number][];
  }>({
    targetInterval: 1,
    referenceCount: BASE_DOT_COUNT,
    targetCount: BASE_DOT_COUNT + STARTING_DELTA,
    frame1Dots: [],
    frame2Dots: [],
  });

  /* ---- Canvas draw helper ---- */
  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, []);

  /* ---- Setup a new trial ---- */
  const setupTrial = useCallback(
    (currentDelta: number) => {
      const targetInterval: 1 | 2 = Math.random() < 0.5 ? 1 : 2;
      const referenceCount = BASE_DOT_COUNT;
      const targetCount = BASE_DOT_COUNT + Math.round(currentDelta);

      const frame1Count = targetInterval === 1 ? targetCount : referenceCount;
      const frame2Count = targetInterval === 2 ? targetCount : referenceCount;

      const frame1Dots = generateDotPositions(frame1Count, CLOUD_RADIUS - DOT_RADIUS);
      const frame2Dots = generateDotPositions(frame2Count, CLOUD_RADIUS - DOT_RADIUS);

      trialRef.current = {
        targetInterval,
        referenceCount,
        targetCount,
        frame1Dots,
        frame2Dots,
      };

      setCurrentTrial({
        trialNumber,
        delta: currentDelta,
        referenceCount,
        targetCount,
        targetInterval,
        response: null,
        correct: null,
        confidence: null,
        rt: null,
      });
    },
    [trialNumber]
  );

  /* ---- Phase sequencing ---- */
  const runPhaseSequence = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    // Fixation
    drawFixation(ctx, w, h);
    setPhase("fixation");

    timerRef.current = setTimeout(() => {
      // Frame 1
      drawDots(ctx, trialRef.current.frame1Dots, w, h);
      setPhase("frame1");

      timerRef.current = setTimeout(() => {
        // ISI
        clearCanvas(ctx, w, h);
        setPhase("isi");

        timerRef.current = setTimeout(() => {
          // Frame 2
          drawDots(ctx, trialRef.current.frame2Dots, w, h);
          setPhase("frame2");

          timerRef.current = setTimeout(() => {
            // Response screen
            clearCanvas(ctx, w, h);
            setPhase("response");
            responseStartRef.current = performance.now();
          }, FRAME_MS);
        }, ISI_MS);
      }, FRAME_MS);
    }, FIXATION_MS);
  }, [getCtx]);

  /* ---- Start trial ---- */
  useEffect(() => {
    if (finished) return;
    setupTrial(delta);
    // small delay so state settles before drawing
    const t = setTimeout(() => {
      runPhaseSequence();
    }, 50);
    return () => {
      clearTimeout(t);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // We only want to re-run when trialNumber changes (new trial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialNumber, finished]);

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    const timerRefCurrent = timerRef.current;
    const animFrameRefCurrent = animFrameRef.current;
    return () => {
      if (timerRefCurrent) clearTimeout(timerRefCurrent);
      if (animFrameRefCurrent) cancelAnimationFrame(animFrameRefCurrent);
    };
  }, []);

  /* ---- Handle interval response ---- */
  const handleResponse = useCallback(
    (chosen: 1 | 2) => {
      if (phase !== "response" || !currentTrial) return;

      const rt = performance.now() - responseStartRef.current;
      const correct = chosen === trialRef.current.targetInterval;

      setCurrentTrial((prev) =>
        prev ? { ...prev, response: chosen, correct, rt } : null
      );
      setPhase("confidence");
    },
    [phase, currentTrial]
  );

  /* ---- Handle confidence response ---- */
  const handleConfidence = useCallback(
    (conf: number) => {
      if (phase !== "confidence" || !currentTrial) return;

      const finalTrial: TrialData = {
        ...currentTrial,
        confidence: conf,
        correct:
          currentTrial.response === trialRef.current.targetInterval,
        rt: currentTrial.rt,
      };

      setResults((prev) => [...prev, finalTrial]);

      // Staircase update (2-down / 1-up in log space)
      const isCorrect = finalTrial.correct ?? false;

      let newDelta = delta;
      let newConsecutive = consecutiveCorrect;

      if (isCorrect) {
        newConsecutive = consecutiveCorrect + 1;
        if (newConsecutive >= 2) {
          // Step down (make harder)
          newDelta = Math.max(MIN_DELTA, delta / STEP_FACTOR);
          newConsecutive = 0;
        }
      } else {
        // Step up (make easier)
        newDelta = Math.min(MAX_DELTA, delta * STEP_FACTOR);
        newConsecutive = 0;
      }

      setDelta(newDelta);
      setConsecutiveCorrect(newConsecutive);

      // ITI then advance
      setPhase("iti");
      const ctx = getCtx();
      const canvas = canvasRef.current;
      if (ctx && canvas) clearCanvas(ctx, canvas.width, canvas.height);

      timerRef.current = setTimeout(() => {
        if (trialNumber >= TOTAL_TRIALS) {
          setFinished(true);
          onComplete();
        } else {
          setTrialNumber((n) => n + 1);
        }
      }, ITI_MS);
    },
    [
      phase,
      currentTrial,
      delta,
      consecutiveCorrect,
      trialNumber,
      getCtx,
      onComplete,
    ]
  );

  /* ---- Keyboard shortcuts ---- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase === "response") {
        if (e.key === "ArrowLeft" || e.key === "1") handleResponse(1);
        if (e.key === "ArrowRight" || e.key === "2") handleResponse(2);
      }
      if (phase === "confidence") {
        const n = parseInt(e.key);
        if (n >= 1 && n <= 4) handleConfidence(n);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleResponse, handleConfidence]);

  /* ---- Responsive canvas sizing ---- */
  const canvasSize = 280;

  /* ---- Determine what to show below canvas ---- */
  const showCanvas =
    phase === "fixation" ||
    phase === "frame1" ||
    phase === "isi" ||
    phase === "frame2" ||
    phase === "iti";

  const confidenceLabels = [
    { value: 1, label: "1 — Guess" },
    { value: 2, label: "2 — Low" },
    { value: 3, label: "3 — High" },
    { value: 4, label: "4 — Certain" },
  ];

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 bg-background">
        <h2 className="font-display text-2xl text-text-primary">
          Task Complete
        </h2>
        <p className="font-body text-text-secondary text-center max-w-md">
          Thank you. You completed all {TOTAL_TRIALS} trials.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] gap-4 bg-background px-4 py-8 select-none">
      {/* Trial counter */}
      <p className="font-body text-sm text-text-secondary tracking-wide">
        Trial {trialNumber} of {TOTAL_TRIALS}
      </p>

      {/* Canvas area */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: canvasSize, height: canvasSize }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="rounded-lg"
          style={{
            display: showCanvas ? "block" : "none",
          }}
        />

        {/* Response screen */}
        {phase === "response" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <p className="font-display text-lg text-text-primary text-center">
              Which interval had more dots?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleResponse(1)}
                className="px-5 py-3 rounded-lg font-body text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "#4A7C9E" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3d6a89")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4A7C9E")
                }
              >
                Left (First)
              </button>
              <button
                onClick={() => handleResponse(2)}
                className="px-5 py-3 rounded-lg font-body text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "#4A7C9E" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3d6a89")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4A7C9E")
                }
              >
                Right (Second)
              </button>
            </div>
            <p className="font-body text-xs text-text-secondary">
              or press ← / → arrow keys
            </p>
          </div>
        )}

        {/* Confidence screen */}
        {phase === "confidence" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <p className="font-display text-lg text-text-primary text-center">
              How confident are you?
            </p>
            <div className="flex gap-2">
              {confidenceLabels.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleConfidence(value)}
                  className="px-3 py-2.5 rounded-lg font-body text-xs font-medium border transition-colors"
                  style={{
                    borderColor: "#4A7C9E",
                    color: "#4A7C9E",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#4A7C9E";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#4A7C9E";
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="font-body text-xs text-text-secondary">
              or press 1–4
            </p>
          </div>
        )}
      </div>

      {/* Phase indicator — subtle dot */}
      <div className="flex items-center gap-2 h-4">
        {(phase === "frame1" || phase === "frame2") && (
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#4A7C9E" }}
          />
        )}
      </div>
    </div>
  );
}
