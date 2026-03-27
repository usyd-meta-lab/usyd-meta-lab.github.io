"use client";

import { useState, useCallback, useEffect } from "react";

interface Props {
  onComplete: () => void;
}

const DOMAIN = "#4A7C9E";

interface Problem {
  difficulty: "easy" | "medium" | "hard";
  premises: string[];
  question: string;
  options: string[];
  correctIndex: number;
}

const PROBLEMS: Problem[] = [
  // Easy (2-term) - 3 problems
  {
    difficulty: "easy",
    premises: ["Alice is taller than Bob."],
    question: "Who is shorter?",
    options: ["Alice", "Bob", "Cannot determine"],
    correctIndex: 1,
  },
  {
    difficulty: "easy",
    premises: ["The red car is faster than the blue car."],
    question: "Which car is slower?",
    options: ["Red car", "Blue car", "Cannot determine"],
    correctIndex: 1,
  },
  {
    difficulty: "easy",
    premises: ["Sarah scored higher than Mike on the test."],
    question: "Who scored lower?",
    options: ["Sarah", "Mike", "Cannot determine"],
    correctIndex: 1,
  },
  // Medium (3-term) - 4 problems
  {
    difficulty: "medium",
    premises: [
      "Alice is taller than Bob.",
      "Bob is taller than Carol.",
    ],
    question: "Who is the shortest?",
    options: ["Alice", "Bob", "Carol"],
    correctIndex: 2,
  },
  {
    difficulty: "medium",
    premises: [
      "The oak tree is older than the maple tree.",
      "The maple tree is older than the birch tree.",
    ],
    question: "Which tree is the oldest?",
    options: ["Oak", "Maple", "Birch"],
    correctIndex: 0,
  },
  {
    difficulty: "medium",
    premises: [
      "Chemistry is harder than biology.",
      "Physics is harder than chemistry.",
    ],
    question: "Which subject is the easiest?",
    options: ["Physics", "Chemistry", "Biology"],
    correctIndex: 2,
  },
  {
    difficulty: "medium",
    premises: [
      "Restaurant A is more expensive than Restaurant B.",
      "Restaurant B is more expensive than Restaurant C.",
    ],
    question: "Which restaurant is cheapest?",
    options: ["Restaurant A", "Restaurant B", "Restaurant C"],
    correctIndex: 2,
  },
  // Hard (4-term with negations) - 3 problems
  {
    difficulty: "hard",
    premises: [
      "Dave is not shorter than Eve.",
      "Eve is taller than Frank.",
      "Frank is not shorter than Grace.",
    ],
    question: "Who is the shortest?",
    options: ["Dave", "Frank", "Grace"],
    correctIndex: 2,
  },
  {
    difficulty: "hard",
    premises: [
      "Project A does not take less time than Project B.",
      "Project B takes longer than Project C.",
      "Project C does not take less time than Project D.",
    ],
    question: "Which project takes the least time?",
    options: ["Project A", "Project B", "Project D"],
    correctIndex: 2,
  },
  {
    difficulty: "hard",
    premises: [
      "The novel is not shorter than the biography.",
      "The biography is longer than the memoir.",
      "The memoir is not shorter than the essay collection.",
    ],
    question: "Which book is shortest?",
    options: ["Novel", "Memoir", "Essay collection"],
    correctIndex: 2,
  },
];

const CONFIDENCE_LABELS = [
  "Just guessing",
  "Somewhat confident",
  "Fairly confident",
  "Very confident",
];

interface TrialResult {
  correct: boolean;
  confidence: number;
}

export default function RelationalMonitoringTask({ onComplete }: Props) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<"respond" | "confidence" | "next">("respond");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<TrialResult[]>([]);
  const [done, setDone] = useState(false);

  const current = PROBLEMS[trialIndex];

  const handleAnswer = useCallback(
    (index: number) => {
      if (phase !== "respond") return;
      setSelectedAnswer(index);
      setPhase("confidence");
    },
    [phase]
  );

  const handleConfidence = useCallback(
    (conf: number) => {
      const correct = selectedAnswer === current.correctIndex;
      setResults((prev) => [...prev, { correct, confidence: conf }]);
      setSelectedAnswer(null);

      if (trialIndex + 1 >= PROBLEMS.length) {
        setDone(true);
      } else {
        setTrialIndex((i) => i + 1);
        setPhase("respond");
      }
    },
    [selectedAnswer, current, trialIndex]
  );

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 2000);
      return () => clearTimeout(t);
    }
  }, [done, onComplete]);

  // Calibration computation (after trial 5)
  const showCalibration = results.length >= 5;
  const calibrationData = (() => {
    if (!showCalibration) return [];
    const buckets: Record<number, { total: number; correct: number }> = {};
    for (const r of results) {
      if (!buckets[r.confidence]) {
        buckets[r.confidence] = { total: 0, correct: 0 };
      }
      buckets[r.confidence].total++;
      if (r.correct) buckets[r.confidence].correct++;
    }
    return [1, 2, 3, 4].map((conf) => ({
      confidence: conf,
      label: CONFIDENCE_LABELS[conf - 1],
      accuracy: buckets[conf]
        ? Math.round((buckets[conf].correct / buckets[conf].total) * 100)
        : null,
      count: buckets[conf]?.total || 0,
    }));
  })();

  const totalCorrect = results.filter((r) => r.correct).length;

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-xl border border-border p-8 text-center max-w-md">
          <p className="font-display text-xl text-text-primary mb-2">
            Task Complete
          </p>
          <p className="font-body text-text-secondary">
            Accuracy: {totalCorrect} / {results.length} correct
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
            Relational Monitoring
          </h1>
          <span className="font-body text-sm text-text-secondary">
            Trial {trialIndex + 1} / {PROBLEMS.length}
          </span>
        </div>
        <p className="font-body text-xs text-text-secondary mb-4">
          Difficulty: {current.difficulty}
        </p>

        {/* Progress */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(trialIndex / PROBLEMS.length) * 100}%`,
              backgroundColor: DOMAIN,
            }}
          />
        </div>

        {/* Problem */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-4">
          <div className="mb-4 space-y-2">
            {current.premises.map((p, i) => (
              <p key={i} className="font-body text-text-primary">
                {p}
              </p>
            ))}
          </div>
          <p className="font-display text-lg text-text-primary mb-4">
            {current.question}
          </p>

          {phase === "respond" && (
            <div className="flex flex-wrap gap-3">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="px-5 py-2.5 rounded-lg border border-border font-body text-text-primary transition-all hover:border-gray-400"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {phase === "confidence" && (
            <div>
              <p className="font-body text-sm text-text-secondary mb-3">
                How confident are you in your answer?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CONFIDENCE_LABELS.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => handleConfidence(i + 1)}
                    className="px-4 py-3 rounded-lg border border-border font-body text-sm text-text-primary transition-all hover:border-gray-400"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calibration display */}
        {showCalibration && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="font-display text-md text-text-primary mb-3">
              Calibration (Confidence vs. Accuracy)
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {calibrationData.map((d) => (
                <div key={d.confidence} className="text-center">
                  <p className="font-body text-[10px] text-text-secondary mb-1">
                    {d.label}
                  </p>
                  <div className="relative h-24 bg-gray-50 rounded-lg flex items-end justify-center overflow-hidden border border-border">
                    {d.accuracy !== null ? (
                      <div
                        className="w-full rounded-t-sm transition-all"
                        style={{
                          height: `${d.accuracy}%`,
                          backgroundColor: DOMAIN,
                          opacity: 0.7,
                        }}
                      />
                    ) : (
                      <p className="font-body text-[10px] text-text-secondary absolute inset-0 flex items-center justify-center">
                        No data
                      </p>
                    )}
                  </div>
                  <p className="font-body text-xs text-text-primary mt-1">
                    {d.accuracy !== null ? `${d.accuracy}%` : "—"}
                  </p>
                  <p className="font-body text-[10px] text-text-secondary">
                    n={d.count}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-text-secondary mt-2">
              Running accuracy: {totalCorrect}/{results.length} (
              {Math.round((totalCorrect / results.length) * 100)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
