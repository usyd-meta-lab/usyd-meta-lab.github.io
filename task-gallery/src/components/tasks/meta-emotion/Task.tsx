"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface Props {
  onComplete: () => void;
}

const DOMAIN = "#B85C5C";
const TOTAL_TRIALS = 10;
const ITI_MS = 500;

const SCENARIOS = [
  "You arrive at work to find a surprise birthday party set up by your colleagues. Everyone is smiling and cheering as you walk through the door.",
  "You're stuck in heavy traffic and realize you're going to miss an important job interview that you've been preparing for all week.",
  "A close friend calls to tell you they're moving to another country and won't be coming back for several years.",
  "You open your email and discover you've been selected for a prestigious award you applied for months ago and had forgotten about.",
  "You're home alone at night when you hear an unfamiliar, loud noise coming from the basement.",
  "Your partner surprises you by cooking your favorite meal after you've had an exhausting day at work.",
  "You witness a stranger yelling and being rude to an elderly person in a grocery store.",
  "You're walking through a park on a quiet Sunday morning, listening to birdsong, with nothing on your schedule.",
  "You receive unexpected criticism about a project you poured your heart into, in front of your entire team.",
  "You watch a documentary about animals suffering due to environmental destruction and feel powerless to help.",
];

const EMOTION_LABELS = [
  "Joy",
  "Calm",
  "Fear",
  "Sadness",
  "Anger",
  "Surprise",
  "Disgust",
  "Neutral",
];

const CONFIDENCE_LABELS = [
  "Not at all clear",
  "Slightly clear",
  "Mostly clear",
  "Completely clear",
];

interface TrialData {
  scenario: number;
  gridX: number;
  gridY: number;
  emotionLabel: string;
  confidence: number;
}

type TrialPhase = "scenario" | "grid" | "label" | "confidence" | "iti";

export default function MetaEmotionTask({ onComplete }: Props) {
  const [trial, setTrial] = useState(0);
  const [trialPhase, setTrialPhase] = useState<TrialPhase>("scenario");
  const [gridPos, setGridPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [results, setResults] = useState<TrialData[]>([]);
  const [done, setDone] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleGridClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (trialPhase !== "grid" || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 8);
      const y = Math.round((1 - (e.clientY - rect.top) / rect.height) * 8);
      setGridPos({
        x: Math.max(0, Math.min(8, x)),
        y: Math.max(0, Math.min(8, y)),
      });
    },
    [trialPhase]
  );

  const confirmGrid = useCallback(() => {
    if (gridPos) setTrialPhase("label");
  }, [gridPos]);

  const selectEmotion = useCallback((label: string) => {
    setSelectedEmotion(label);
    setTrialPhase("confidence");
  }, []);

  const selectConfidence = useCallback(
    (conf: number) => {
      const data: TrialData = {
        scenario: trial,
        gridX: gridPos?.x ?? 0,
        gridY: gridPos?.y ?? 0,
        emotionLabel: selectedEmotion ?? "",
        confidence: conf,
      };
      setResults((prev) => [...prev, data]);
      setTrialPhase("iti");

      setTimeout(() => {
        if (trial + 1 >= TOTAL_TRIALS) {
          setDone(true);
        } else {
          setTrial((t) => t + 1);
          setTrialPhase("scenario");
          setGridPos(null);
          setSelectedEmotion(null);
        }
      }, ITI_MS);
    },
    [trial, gridPos, selectedEmotion]
  );

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 1000);
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
            You rated {results.length} emotional scenarios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl text-text-primary">
            Emotional Clarity
          </h1>
          <span className="font-body text-sm text-text-secondary">
            Trial {trial + 1} / {TOTAL_TRIALS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((trial) / TOTAL_TRIALS) * 100}%`,
              backgroundColor: DOMAIN,
            }}
          />
        </div>

        {trialPhase === "iti" && (
          <div className="h-64 flex items-center justify-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: DOMAIN }}
            />
          </div>
        )}

        {trialPhase === "scenario" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <p className="font-body text-text-primary text-lg leading-relaxed mb-6">
              {SCENARIOS[trial]}
            </p>
            <p className="font-body text-sm text-text-secondary mb-4">
              Read the scenario above, then indicate how it makes you feel.
            </p>
            <button
              onClick={() => setTrialPhase("grid")}
              className="px-6 py-2 rounded-lg font-body text-white transition-colors"
              style={{ backgroundColor: DOMAIN }}
            >
              Continue
            </button>
          </div>
        )}

        {trialPhase === "grid" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <p className="font-body text-sm text-text-secondary mb-4">
              Click on the grid to place your feeling. X = Valence (unpleasant → pleasant), Y = Arousal (calm → excited).
            </p>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <span className="absolute -left-6 top-0 font-body text-[10px] text-text-secondary rotate-[-90deg] origin-right">
                  High Arousal
                </span>
                <span className="absolute -left-6 bottom-0 font-body text-[10px] text-text-secondary rotate-[-90deg] origin-right">
                  Low Arousal
                </span>
                <svg
                  ref={svgRef}
                  width="280"
                  height="280"
                  viewBox="0 0 280 280"
                  className="border border-border rounded-lg cursor-crosshair bg-gray-50"
                  onClick={handleGridClick}
                >
                  {/* Grid lines */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <g key={i}>
                      <line
                        x1={(i * 280) / 8}
                        y1={0}
                        x2={(i * 280) / 8}
                        y2={280}
                        stroke="#E8E6E0"
                        strokeWidth={i === 4 ? 1.5 : 0.5}
                      />
                      <line
                        x1={0}
                        y1={(i * 280) / 8}
                        x2={280}
                        y2={(i * 280) / 8}
                        stroke="#E8E6E0"
                        strokeWidth={i === 4 ? 1.5 : 0.5}
                      />
                    </g>
                  ))}
                  {gridPos && (
                    <circle
                      cx={(gridPos.x * 280) / 8}
                      cy={280 - (gridPos.y * 280) / 8}
                      r={8}
                      fill={DOMAIN}
                      stroke="white"
                      strokeWidth={2}
                    />
                  )}
                </svg>
                <div className="flex justify-between mt-1">
                  <span className="font-body text-[10px] text-text-secondary">
                    Unpleasant
                  </span>
                  <span className="font-body text-[10px] text-text-secondary">
                    Pleasant
                  </span>
                </div>
              </div>
            </div>
            {gridPos && (
              <div className="text-center">
                <button
                  onClick={confirmGrid}
                  className="px-6 py-2 rounded-lg font-body text-white transition-colors"
                  style={{ backgroundColor: DOMAIN }}
                >
                  Confirm Placement
                </button>
              </div>
            )}
          </div>
        )}

        {trialPhase === "label" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <p className="font-body text-sm text-text-secondary mb-4">
              Which emotion best describes what you felt?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EMOTION_LABELS.map((label) => (
                <button
                  key={label}
                  onClick={() => selectEmotion(label)}
                  className="px-4 py-3 rounded-lg border border-border font-body text-text-primary hover:border-current transition-colors"
                  style={{
                    borderColor:
                      selectedEmotion === label ? DOMAIN : undefined,
                    color: selectedEmotion === label ? DOMAIN : undefined,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {trialPhase === "confidence" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <p className="font-body text-sm text-text-secondary mb-4">
              How clear are you about what you&apos;re feeling?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CONFIDENCE_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => selectConfidence(i + 1)}
                  className="px-4 py-3 rounded-lg border border-border font-body text-sm text-text-primary hover:border-current transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
