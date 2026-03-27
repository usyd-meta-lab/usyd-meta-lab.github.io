"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TaskType = "parity" | "magnitude";

interface Trial {
  digit: number;
  task: TaskType;
  isSwitch: boolean; // relative to previous trial's task
}

interface TrialResult {
  digit: number;
  task: TaskType;
  isSwitch: boolean;
  correct: boolean;
  rt: number; // ms
}

type Phase =
  | "ready"
  | "practice-intro"
  | "practice-parity-intro"
  | "practice-magnitude-intro"
  | "fixation"
  | "stimulus"
  | "feedback"
  | "iti"
  | "test-intro"
  | "stats"
  | "done";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DIGITS = [1, 2, 3, 4, 6, 7, 8, 9]; // 1-9 excluding 5
const BLUE = "#3B82F6";
const YELLOW = "#EAB308";
const DOMAIN_COLOR = "#C4874A";

const FIXATION_MS = 150;
const CSI_MS = 300; // cue-stimulus interval (box appears, then digit after CSI)
const MAX_RESPONSE_MS = 3000;
const SLOW_THRESHOLD_MS = 2000;
const ITI_REPEAT_MS = 1000;
const ITI_SWITCH_MS = 1200;

const PRACTICE_PARITY_COUNT = 8;
const PRACTICE_MAGNITUDE_COUNT = 8;
const TEST_TRIAL_COUNT = 48;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomDigit(): number {
  return DIGITS[Math.floor(Math.random() * DIGITS.length)];
}

function isCorrect(digit: number, task: TaskType, side: "left" | "right"): boolean {
  if (task === "parity") {
    const odd = digit % 2 !== 0;
    return side === "left" ? odd : !odd; // Left=Odd, Right=Even
  } else {
    const low = digit < 5;
    return side === "left" ? low : !low; // Left=Low, Right=High
  }
}

function generatePracticeTrials(): Trial[] {
  const trials: Trial[] = [];
  // 8 pure parity
  for (let i = 0; i < PRACTICE_PARITY_COUNT; i++) {
    trials.push({ digit: randomDigit(), task: "parity", isSwitch: false });
  }
  // 8 pure magnitude
  for (let i = 0; i < PRACTICE_MAGNITUDE_COUNT; i++) {
    trials.push({ digit: randomDigit(), task: "magnitude", isSwitch: false });
  }
  return trials;
}

function generateTestTrials(): Trial[] {
  const trials: Trial[] = [];
  const tasks: TaskType[] = [];

  // Build a randomised sequence of 48 tasks ensuring a reasonable mix
  for (let i = 0; i < TEST_TRIAL_COUNT; i++) {
    tasks.push(Math.random() < 0.5 ? "parity" : "magnitude");
  }

  for (let i = 0; i < TEST_TRIAL_COUNT; i++) {
    trials.push({
      digit: randomDigit(),
      task: tasks[i],
      isSwitch: i > 0 && tasks[i] !== tasks[i - 1],
    });
  }
  return trials;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TaskSwitchingTask({ onComplete }: { onComplete: () => void }) {
  /* -- state -------------------------------------------------------- */
  const [phase, setPhase] = useState<Phase>("ready");
  const [practiceTrials] = useState<Trial[]>(() => generatePracticeTrials());
  const [testTrials] = useState<Trial[]>(() => generateTestTrials());
  const [trialIndex, setTrialIndex] = useState(0);
  const [isPractice, setIsPractice] = useState(true);
  const [results, setResults] = useState<TrialResult[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    tooSlow: boolean;
  } | null>(null);

  const stimulusOnset = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responded = useRef(false);

  const trials = isPractice ? practiceTrials : testTrials;
  const currentTrial: Trial | undefined = trials[trialIndex];

  /* -- clean up timers on unmount ----------------------------------- */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* -- advance helper ---------------------------------------------- */
  const advanceToNext = useCallback(
    (result: TrialResult) => {
      const itiMs = result.isSwitch ? ITI_SWITCH_MS : ITI_REPEAT_MS;
      setPhase("iti");
      timerRef.current = setTimeout(() => {
        const nextIndex = trialIndex + 1;
        if (nextIndex >= trials.length) {
          if (isPractice) {
            // Move to test phase
            setIsPractice(false);
            setTrialIndex(0);
            setPhase("test-intro");
          } else {
            setPhase("done");
          }
        } else {
          // If practice & crossing from parity block to magnitude block
          if (isPractice && nextIndex === PRACTICE_PARITY_COUNT) {
            setTrialIndex(nextIndex);
            setPhase("practice-magnitude-intro");
          } else {
            setTrialIndex(nextIndex);
            setPhase("fixation");
          }
        }
      }, itiMs);
    },
    [trialIndex, trials.length, isPractice],
  );

  /* -- start a trial (fixation -> cue -> stimulus) ------------------- */
  useEffect(() => {
    if (phase === "fixation") {
      responded.current = false;
      timerRef.current = setTimeout(() => {
        // Show coloured box (cue) then after CSI show digit
        setPhase("stimulus");
        stimulusOnset.current = performance.now();

        // Timeout after MAX_RESPONSE_MS
        timerRef.current = setTimeout(() => {
          if (!responded.current && currentTrial) {
            responded.current = true;
            const result: TrialResult = {
              digit: currentTrial.digit,
              task: currentTrial.task,
              isSwitch: currentTrial.isSwitch,
              correct: false,
              rt: MAX_RESPONSE_MS,
            };
            setResults((prev) => [...prev, result]);
            if (isPractice) {
              setLastFeedback({ correct: false, tooSlow: true });
              setPhase("feedback");
              timerRef.current = setTimeout(() => advanceToNext(result), 1200);
            } else {
              advanceToNext(result);
            }
          }
        }, MAX_RESPONSE_MS);
      }, FIXATION_MS + CSI_MS);
    }
  }, [phase, currentTrial, isPractice, advanceToNext]);

  /* -- handle response ---------------------------------------------- */
  const handleResponse = useCallback(
    (side: "left" | "right") => {
      if (phase !== "stimulus" || !currentTrial || responded.current) return;
      responded.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);

      const rt = performance.now() - stimulusOnset.current;
      const correct = isCorrect(currentTrial.digit, currentTrial.task, side);
      const result: TrialResult = {
        digit: currentTrial.digit,
        task: currentTrial.task,
        isSwitch: currentTrial.isSwitch,
        correct,
        rt,
      };
      setResults((prev) => [...prev, result]);

      if (isPractice) {
        const tooSlow = rt > SLOW_THRESHOLD_MS;
        setLastFeedback({ correct, tooSlow });
        setPhase("feedback");
        timerRef.current = setTimeout(() => advanceToNext(result), 1000);
      } else {
        advanceToNext(result);
      }
    },
    [phase, currentTrial, isPractice, advanceToNext],
  );

  /* -- keyboard support -------------------------------------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        handleResponse("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        handleResponse("right");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleResponse]);

  /* -- stats computation ------------------------------------------- */
  const testResults = results.filter(
    (_, i) => i >= PRACTICE_PARITY_COUNT + PRACTICE_MAGNITUDE_COUNT,
  );

  // Update chart data every 8 test trials
  const chartTrialCount = Math.floor(testResults.length / 8) * 8;
  const chartSlice = testResults.slice(0, chartTrialCount);

  const switchTrials = chartSlice.filter((r) => r.isSwitch && r.correct);
  const repeatTrials = chartSlice.filter((r) => !r.isSwitch && r.correct);

  const meanSwitchRT =
    switchTrials.length > 0
      ? Math.round(switchTrials.reduce((s, r) => s + r.rt, 0) / switchTrials.length)
      : 0;
  const meanRepeatRT =
    repeatTrials.length > 0
      ? Math.round(repeatTrials.reduce((s, r) => s + r.rt, 0) / repeatTrials.length)
      : 0;

  const chartData = [
    { label: "Repeat", rt: meanRepeatRT },
    { label: "Switch", rt: meanSwitchRT },
  ];

  const barColors = ["#5A8C6A", DOMAIN_COLOR];

  /* -- done -------------------------------------------------------- */
  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  // Intro / ready screen
  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-6">
          <h1 className="font-display text-3xl text-text-primary">Task Switching</h1>
          <p className="font-body text-text-secondary leading-relaxed">
            You will see a digit inside a coloured box. The colour tells you which
            judgement to make:
          </p>
          <div className="flex justify-center gap-6 font-body text-sm">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-5 h-5 rounded"
                style={{ backgroundColor: BLUE }}
              />
              <span className="text-text-primary">
                Blue = <strong>Odd / Even</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-5 h-5 rounded"
                style={{ backgroundColor: YELLOW }}
              />
              <span className="text-text-primary">
                Yellow = <strong>Low / High</strong>
              </span>
            </div>
          </div>
          <div className="font-body text-text-secondary text-sm space-y-1">
            <p>
              <strong>Left</strong> button (or A / Arrow Left) = <em>Odd</em> or <em>Low</em>
            </p>
            <p>
              <strong>Right</strong> button (or D / Arrow Right) = <em>Even</em> or <em>High</em>
            </p>
          </div>
          <button
            onClick={() => setPhase("practice-parity-intro")}
            className="mt-4 px-8 py-3 rounded-lg font-body font-semibold text-white transition-colors"
            style={{ backgroundColor: DOMAIN_COLOR }}
          >
            Begin Practice
          </button>
        </div>
      </div>
    );
  }

  // Practice parity intro
  if (phase === "practice-parity-intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center space-y-5">
          <h2 className="font-display text-2xl text-text-primary">Practice: Parity</h2>
          <p className="font-body text-text-secondary leading-relaxed">
            For the next 8 trials the box will be{" "}
            <span className="font-semibold" style={{ color: BLUE }}>
              blue
            </span>
            . Decide if the digit is <strong>Odd</strong> (Left) or <strong>Even</strong>{" "}
            (Right).
          </p>
          <button
            onClick={() => {
              setTrialIndex(0);
              setPhase("fixation");
            }}
            className="px-8 py-3 rounded-lg font-body font-semibold text-white transition-colors"
            style={{ backgroundColor: DOMAIN_COLOR }}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // Practice magnitude intro
  if (phase === "practice-magnitude-intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center space-y-5">
          <h2 className="font-display text-2xl text-text-primary">Practice: Magnitude</h2>
          <p className="font-body text-text-secondary leading-relaxed">
            For the next 8 trials the box will be{" "}
            <span className="font-semibold" style={{ color: YELLOW }}>
              yellow
            </span>
            . Decide if the digit is <strong>Low (&lt; 5)</strong> (Left) or{" "}
            <strong>High (&gt; 5)</strong> (Right).
          </p>
          <button
            onClick={() => setPhase("fixation")}
            className="px-8 py-3 rounded-lg font-body font-semibold text-white transition-colors"
            style={{ backgroundColor: DOMAIN_COLOR }}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // Test intro
  if (phase === "test-intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center space-y-5">
          <h2 className="font-display text-2xl text-text-primary">Test Phase</h2>
          <p className="font-body text-text-secondary leading-relaxed">
            Great job! Now the task type will switch randomly between{" "}
            <span className="font-semibold" style={{ color: BLUE }}>
              Parity
            </span>{" "}
            and{" "}
            <span className="font-semibold" style={{ color: YELLOW }}>
              Magnitude
            </span>
            . There will be 48 trials with no feedback. Respond as quickly and accurately
            as possible.
          </p>
          <button
            onClick={() => {
              setTrialIndex(0);
              setPhase("fixation");
            }}
            className="px-8 py-3 rounded-lg font-body font-semibold text-white transition-colors"
            style={{ backgroundColor: DOMAIN_COLOR }}
          >
            Begin Test
          </button>
        </div>
      </div>
    );
  }

  // Done
  if (phase === "done") {
    const allTest = results.filter(
      (_, i) => i >= PRACTICE_PARITY_COUNT + PRACTICE_MAGNITUDE_COUNT,
    );
    const accuracy = allTest.length > 0
      ? Math.round((allTest.filter((r) => r.correct).length / allTest.length) * 100)
      : 0;
    const overallRT = allTest.filter((r) => r.correct).length > 0
      ? Math.round(
          allTest.filter((r) => r.correct).reduce((s, r) => s + r.rt, 0) /
            allTest.filter((r) => r.correct).length,
        )
      : 0;

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center space-y-5">
          <h2 className="font-display text-2xl text-text-primary">Task Complete</h2>
          <div className="font-body text-text-secondary space-y-2">
            <p>
              Accuracy: <strong className="text-text-primary">{accuracy}%</strong>
            </p>
            <p>
              Mean RT (correct): <strong className="text-text-primary">{overallRT} ms</strong>
            </p>
            {meanSwitchRT > 0 && meanRepeatRT > 0 && (
              <p>
                Switch cost:{" "}
                <strong className="text-text-primary">
                  {meanSwitchRT - meanRepeatRT} ms
                </strong>
              </p>
            )}
          </div>
          <p className="font-body text-xs text-text-secondary">Redirecting...</p>
        </div>
      </div>
    );
  }

  /* -- Active trial phases ----------------------------------------- */

  const boxColor = currentTrial?.task === "parity" ? BLUE : YELLOW;
  const taskLabel = currentTrial?.task === "parity" ? "Odd / Even" : "Low / High";

  // Determine which labels to show on buttons
  const leftLabel = currentTrial?.task === "parity" ? "Odd" : "Low";
  const rightLabel = currentTrial?.task === "parity" ? "Even" : "High";

  // Progress
  const totalTrials = isPractice
    ? PRACTICE_PARITY_COUNT + PRACTICE_MAGNITUDE_COUNT
    : TEST_TRIAL_COUNT;
  const currentNum = trialIndex + 1;
  const phaseLabel = isPractice ? "Practice" : "Test";

  // Show chart only in test phase and when there are at least 8 completed test trials
  const showChart = !isPractice && chartTrialCount >= 8;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 select-none">
      {/* Header info */}
      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <div className="font-body text-xs text-text-secondary tracking-wide">
          {phaseLabel} &mdash; Trial {currentNum} / {totalTrials}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-col items-center gap-8">
        {/* The stimulus box */}
        <div
          className="relative flex items-center justify-center rounded-2xl transition-colors duration-150"
          style={{
            width: 180,
            height: 180,
            backgroundColor:
              phase === "fixation" ? "#E8E6E0" : boxColor,
          }}
        >
          {phase === "fixation" && (
            <span className="text-4xl font-body text-text-secondary select-none">+</span>
          )}
          {phase === "stimulus" && currentTrial && (
            <span className="text-6xl font-display font-bold text-white select-none">
              {currentTrial.digit}
            </span>
          )}
          {phase === "feedback" && lastFeedback && (
            <span
              className={`text-xl font-body font-semibold select-none ${
                lastFeedback.tooSlow
                  ? "text-red-400"
                  : lastFeedback.correct
                  ? "text-emerald-200"
                  : "text-red-300"
              }`}
            >
              {lastFeedback.tooSlow
                ? "Too slow!"
                : lastFeedback.correct
                ? "Correct"
                : "Incorrect"}
            </span>
          )}
          {phase === "iti" && (
            <span className="text-text-secondary/40 text-lg font-body">&bull;</span>
          )}
        </div>

        {/* Task cue label */}
        <div className="font-body text-sm text-text-secondary h-5">
          {(phase === "stimulus" || phase === "feedback") && taskLabel}
        </div>

        {/* Response buttons */}
        <div className="flex gap-6">
          <button
            onClick={() => handleResponse("left")}
            disabled={phase !== "stimulus"}
            className="w-32 py-3 rounded-lg font-body font-semibold text-sm border-2 transition-all disabled:opacity-30 disabled:cursor-default"
            style={{
              borderColor: phase === "stimulus" ? boxColor : "#E8E6E0",
              color: phase === "stimulus" ? boxColor : "#6B6B65",
            }}
          >
            {leftLabel}
            <span className="block text-[10px] font-normal text-text-secondary mt-0.5">
              A / Left
            </span>
          </button>
          <button
            onClick={() => handleResponse("right")}
            disabled={phase !== "stimulus"}
            className="w-32 py-3 rounded-lg font-body font-semibold text-sm border-2 transition-all disabled:opacity-30 disabled:cursor-default"
            style={{
              borderColor: phase === "stimulus" ? boxColor : "#E8E6E0",
              color: phase === "stimulus" ? boxColor : "#6B6B65",
            }}
          >
            {rightLabel}
            <span className="block text-[10px] font-normal text-text-secondary mt-0.5">
              D / Right
            </span>
          </button>
        </div>
      </div>

      {/* Live stats bar chart (test phase only) */}
      {showChart && (
        <div className="absolute bottom-8 right-8 bg-surface border border-border rounded-xl p-4 shadow-sm"
          style={{ width: 240 }}
        >
          <h3 className="font-body text-xs font-semibold text-text-primary mb-2 text-center">
            Mean RT (correct)
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6B6B65", fontFamily: "var(--font-dm-sans)" }}
                axisLine={{ stroke: "#E8E6E0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6B6B65" }}
                axisLine={false}
                tickLine={false}
                width={40}
                unit="ms"
              />
              <Tooltip
                formatter={(value) => [`${value} ms`, "RT"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #E8E6E0",
                }}
              />
              <Bar dataKey="rt" radius={[4, 4, 0, 0]} barSize={36}>
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={barColors[idx]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="font-body text-[10px] text-text-secondary text-center mt-1">
            Updated every 8 trials
          </p>
        </div>
      )}
    </div>
  );
}
