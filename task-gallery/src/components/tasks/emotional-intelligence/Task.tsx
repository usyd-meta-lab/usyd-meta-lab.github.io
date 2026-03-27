"use client";

import { useState, useCallback, useEffect } from "react";

interface Props {
  onComplete: () => void;
}

const DOMAIN = "#B85C5C";

// Branch 1: Perceiving emotions - rate 5 emotions on 5-point scales
interface Branch1Trial {
  type: "perceive";
  scenario: string;
  expectedRatings: { happiness: number; sadness: number; fear: number; anger: number; surprise: number };
}

// Branch 2: Understanding emotions - multiple choice
interface Branch2Trial {
  type: "understand";
  question: string;
  options: string[];
  correctIndex: number;
}

type Trial = Branch1Trial | Branch2Trial;

const BRANCH1_TRIALS: Branch1Trial[] = [
  {
    type: "perceive",
    scenario:
      "Maria walks into a meeting room. Her eyes are wide, her mouth is slightly open, and she grips her folder tightly against her chest as she scans the unfamiliar faces.",
    expectedRatings: { happiness: 1, sadness: 1, fear: 4, anger: 1, surprise: 3 },
  },
  {
    type: "perceive",
    scenario:
      "After hearing the announcement, James slowly sits back in his chair. His shoulders drop, and he stares at the floor with a distant, unfocused gaze.",
    expectedRatings: { happiness: 1, sadness: 5, fear: 1, anger: 2, surprise: 2 },
  },
  {
    type: "perceive",
    scenario:
      "Sophie reads the letter and her face breaks into a broad smile. She jumps up from her chair and immediately calls her best friend.",
    expectedRatings: { happiness: 5, sadness: 1, fear: 1, anger: 1, surprise: 3 },
  },
  {
    type: "perceive",
    scenario:
      "Tom discovers that his colleague has been taking credit for his work. His jaw clenches, his nostrils flare, and he speaks in a low, controlled voice when confronting them.",
    expectedRatings: { happiness: 1, sadness: 2, fear: 1, anger: 5, surprise: 2 },
  },
  {
    type: "perceive",
    scenario:
      "Elena returns home to find her living room filled with balloons and friends shouting. She freezes in the doorway, her hands fly to her face, and tears begin streaming down her cheeks as she laughs.",
    expectedRatings: { happiness: 5, sadness: 1, fear: 1, anger: 1, surprise: 5 },
  },
  {
    type: "perceive",
    scenario:
      "David sits quietly on the park bench watching children play. His expression is calm but his eyes look misty, and occasionally he glances at an old photograph in his hand.",
    expectedRatings: { happiness: 2, sadness: 4, fear: 1, anger: 1, surprise: 1 },
  },
];

const BRANCH2_TRIALS: Branch2Trial[] = [
  {
    type: "understand",
    question:
      "A manager learns that a trusted employee has been secretly interviewing at competitor firms. What combination of emotions is the manager most likely feeling?",
    options: [
      "Happiness and relief",
      "Betrayal and anxiety",
      "Surprise and amusement",
      "Boredom and indifference",
    ],
    correctIndex: 1,
  },
  {
    type: "understand",
    question:
      "When someone feels guilty about being angry at a loved one, which emotion is likely to emerge?",
    options: ["Pride", "Contempt", "Shame", "Excitement"],
    correctIndex: 2,
  },
  {
    type: "understand",
    question:
      "A student who has been studying extremely hard receives a grade that is only slightly above average. What are they most likely to feel?",
    options: [
      "Pure happiness about passing",
      "Frustration and disappointment",
      "Complete indifference",
      "Fear about future exams",
    ],
    correctIndex: 1,
  },
  {
    type: "understand",
    question:
      "After a heated argument, both parties fall silent. Which emotional process is most likely occurring during this silence?",
    options: [
      "Both have forgotten the argument",
      "Emotional regulation and reflection",
      "Growing indifference",
      "Increasing excitement",
    ],
    correctIndex: 1,
  },
  {
    type: "understand",
    question:
      "A person who was initially terrified of public speaking finishes their first presentation and receives applause. What complex emotion are they most likely experiencing?",
    options: [
      "Pure terror",
      "Profound boredom",
      "Relief mixed with pride",
      "Anger at the audience",
    ],
    correctIndex: 2,
  },
  {
    type: "understand",
    question:
      "A child sees their parent cry for the first time. What is the child most likely to feel?",
    options: [
      "Happiness that the parent is showing emotion",
      "Confusion and concern",
      "Anger at the parent",
      "Complete indifference",
    ],
    correctIndex: 1,
  },
  {
    type: "understand",
    question:
      "When someone receives a compliment they believe is insincere, what emotion typically arises?",
    options: [
      "Genuine gratitude",
      "Suspicion and mild irritation",
      "Overwhelming joy",
      "Deep sadness",
    ],
    correctIndex: 1,
  },
  {
    type: "understand",
    question:
      "A person achieves a long-sought goal but realizes the journey was more fulfilling than the destination. What are they likely feeling?",
    options: [
      "Pure euphoria",
      "Rage and frustration",
      "Bittersweet satisfaction with a sense of emptiness",
      "Complete relief with no other emotions",
    ],
    correctIndex: 2,
  },
];

const ALL_TRIALS: Trial[] = [...BRANCH1_TRIALS, ...BRANCH2_TRIALS];
const EMOTIONS = ["happiness", "sadness", "fear", "anger", "surprise"] as const;

export default function EmotionalIntelligenceTask({ onComplete }: Props) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({
    happiness: 3,
    sadness: 3,
    fear: 3,
    anger: 3,
    surprise: 3,
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const currentTrial = ALL_TRIALS[trialIndex];

  const submitPerceive = useCallback(() => {
    const trial = currentTrial as Branch1Trial;
    // Score: average closeness across emotions
    let trialScore = 0;
    for (const e of EMOTIONS) {
      const diff = Math.abs(ratings[e] - trial.expectedRatings[e]);
      trialScore += Math.max(0, 5 - diff);
    }
    setScore((s) => s + trialScore);

    if (trialIndex + 1 >= ALL_TRIALS.length) {
      setDone(true);
    } else {
      setTrialIndex((i) => i + 1);
      setRatings({ happiness: 3, sadness: 3, fear: 3, anger: 3, surprise: 3 });
    }
  }, [currentTrial, ratings, trialIndex]);

  const submitUnderstand = useCallback(
    (optionIndex: number) => {
      const trial = currentTrial as Branch2Trial;
      const correct = optionIndex === trial.correctIndex;
      setSelectedOption(optionIndex);
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) setScore((s) => s + 5);

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        if (trialIndex + 1 >= ALL_TRIALS.length) {
          setDone(true);
        } else {
          setTrialIndex((i) => i + 1);
        }
      }, 800);
    },
    [currentTrial, trialIndex]
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
            Your emotional intelligence score: {score} / {ALL_TRIALS.length * 5}
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
            Emotional Intelligence
          </h1>
          <span className="font-body text-sm text-text-secondary">
            {trialIndex + 1} / {ALL_TRIALS.length}
          </span>
        </div>

        <p className="font-body text-xs text-text-secondary mb-4">
          {currentTrial.type === "perceive"
            ? "Branch 1: Perceiving Emotions"
            : "Branch 2: Understanding Emotions"}
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(trialIndex / ALL_TRIALS.length) * 100}%`,
              backgroundColor: DOMAIN,
            }}
          />
        </div>

        {currentTrial.type === "perceive" && (
          <div className="bg-surface rounded-xl border border-border p-6">
            <p className="font-body text-text-primary leading-relaxed mb-6">
              {currentTrial.scenario}
            </p>
            <p className="font-body text-sm text-text-secondary mb-4">
              Rate how strongly each emotion is being expressed (1 = not at all, 5 = very strongly):
            </p>
            <div className="space-y-4">
              {EMOTIONS.map((emotion) => (
                <div key={emotion} className="flex items-center gap-3">
                  <span className="font-body text-sm text-text-primary w-24 capitalize">
                    {emotion}
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() =>
                          setRatings((prev) => ({ ...prev, [emotion]: val }))
                        }
                        className="w-9 h-9 rounded-lg border font-body text-sm transition-all"
                        style={{
                          backgroundColor:
                            ratings[emotion] === val ? DOMAIN : "transparent",
                          color:
                            ratings[emotion] === val ? "white" : "#1A1A18",
                          borderColor:
                            ratings[emotion] === val ? DOMAIN : "#E8E6E0",
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submitPerceive}
              className="mt-6 px-6 py-2 rounded-lg font-body text-white transition-colors"
              style={{ backgroundColor: DOMAIN }}
            >
              Submit Ratings
            </button>
          </div>
        )}

        {currentTrial.type === "understand" && (
          <div className="bg-surface rounded-xl border border-border p-6">
            <p className="font-body text-text-primary leading-relaxed mb-6">
              {currentTrial.question}
            </p>
            <div className="space-y-3">
              {currentTrial.options.map((option, i) => {
                let bgColor = "transparent";
                let borderCol = "#E8E6E0";
                if (feedback && selectedOption === i) {
                  bgColor = feedback === "correct" ? "#dcfce7" : "#fecaca";
                  borderCol = feedback === "correct" ? "#22c55e" : "#ef4444";
                }
                if (feedback && i === currentTrial.correctIndex && feedback === "incorrect") {
                  borderCol = "#22c55e";
                }
                return (
                  <button
                    key={i}
                    onClick={() => !feedback && submitUnderstand(i)}
                    disabled={!!feedback}
                    className="w-full text-left px-4 py-3 rounded-lg border font-body text-sm text-text-primary transition-all"
                    style={{ backgroundColor: bgColor, borderColor: borderCol }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
