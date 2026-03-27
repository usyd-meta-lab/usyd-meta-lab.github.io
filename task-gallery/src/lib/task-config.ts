import type { CognitiveDomain } from "./domain-colours";

export interface TaskConfig {
  slug: string;
  title: string;
  domain: CognitiveDomain;
  cognitiveAbility: string;
  targetPaper: string;
  publicationUrl: string;
  demoGuidanceMinutes: number;
  instructionBullets: string[];
  whatThisMeasures: string;
  summaryFact: string;
}

export const TASKS: TaskConfig[] = [
  {
    slug: "meta-dprime",
    title: "Meta-d' Perceptual Task",
    domain: "Metacognition",
    cognitiveAbility: "Metacognitive Efficiency",
    targetPaper: "Rouault et al. (2018), Psychological Medicine",
    publicationUrl: "https://doi.org/10.1017/S0033291718000405",
    demoGuidanceMinutes: 6,
    instructionBullets: [
      "You will see two intervals of flickering dots — one contains a slightly higher number of dots",
      "Decide which interval had more dots (left or right)",
      "After each decision, rate your confidence from 1 (guessing) to 4 (certain)",
      "There are no trick questions — follow your instinct and be honest about your confidence",
    ],
    whatThisMeasures:
      "Meta-d' (meta-d prime) quantifies how efficiently a person uses their first-order perceptual sensitivity to generate accurate confidence judgements. A high meta-d'/d' ratio (Mratio) indicates well-calibrated metacognitive monitoring.",
    summaryFact:
      "The ratio of meta-d' to d' (Mratio) is the gold standard measure of metacognitive efficiency and is linked to psychiatric symptom severity, emotional suppression, and general intelligence.",
  },
  {
    slug: "matrix-reasoning",
    title: "Matrix Reasoning",
    domain: "Reasoning",
    cognitiveAbility: "Fluid Intelligence",
    targetPaper: "Matzen et al. (2010), Intelligence",
    publicationUrl: "https://doi.org/10.1016/j.intell.2010.09.005",
    demoGuidanceMinutes: 5,
    instructionBullets: [
      "You will see a 3×3 grid of abstract patterns with one cell missing (bottom-right)",
      "Choose the pattern from 6 options that correctly completes the matrix",
      "Look for rules about shape, number, rotation, shading, or position",
      "Take your time — accuracy matters more than speed",
    ],
    whatThisMeasures:
      "Matrix reasoning tasks (Raven's Progressive Matrices style) are among the purest measures of fluid intelligence — the capacity to reason about novel abstract relationships without relying on prior knowledge.",
    summaryFact:
      "Matrix reasoning shows among the highest correlations with general intelligence (g) of any cognitive task and predicts academic and occupational outcomes across the lifespan.",
  },
  {
    slug: "beer-game",
    title: "Beer Distribution Game",
    domain: "Reasoning",
    cognitiveAbility: "Systems Thinking",
    targetPaper: "Sterman (1989), Management Science",
    publicationUrl: "https://doi.org/10.1287/mnsc.35.3.321",
    demoGuidanceMinutes: 7,
    instructionBullets: [
      "You are managing inventory at one level of a beer supply chain (Retailer)",
      "Each week, customers place orders — fulfil them from your stock",
      "Place orders upstream to maintain your inventory and avoid shortages",
      "Watch out: there are delays between ordering and receiving stock",
      "Your goal is to minimise total costs (holding cost + backlog cost)",
    ],
    whatThisMeasures:
      "The Beer Game simulates a four-stage supply chain. It demonstrates how local rational decisions produce system-wide oscillations — the 'bullwhip effect.' Performance reflects understanding of feedback delays and systems thinking.",
    summaryFact:
      "In Sterman's original study, all participants — including experienced managers — generated large oscillations even though the optimal strategy is simple. Bullwhip effects cost global supply chains an estimated $1 trillion annually.",
  },
  {
    slug: "complex-problem-solving",
    title: "Complex Problem Solving",
    domain: "Reasoning",
    cognitiveAbility: "Complex Problem Solving",
    targetPaper: "Wüstenberg et al. (2012), Intelligence",
    publicationUrl: "https://doi.org/10.1016/j.intell.2012.02.004",
    demoGuidanceMinutes: 8,
    instructionBullets: [
      "You are managing a small tailoring business with several levers to adjust (staff, machines, advertising)",
      "Your goal is to maximise profit over 10 rounds",
      "Variables interact — changing one affects others in ways you must discover",
      "Explore systematically: vary one thing at a time to learn how the system works",
    ],
    whatThisMeasures:
      "Complex problem solving tasks assess the ability to explore, model, and control dynamic systems with multiple interacting variables — a construct related to but distinct from fluid intelligence.",
    summaryFact:
      "Performance on complex problem solving tasks predicts occupational success independently of IQ, particularly in managerial and engineering roles.",
  },
  {
    slug: "meta-emotion",
    title: "Meta-Emotion Task",
    domain: "Emotion",
    cognitiveAbility: "Emotional Clarity",
    targetPaper: "Double et al.; Salovey et al. (1995)",
    publicationUrl: "https://doi.org/10.1037/0022-3514.69.1.125",
    demoGuidanceMinutes: 5,
    instructionBullets: [
      "You will be shown a series of evocative images and brief scenarios",
      "After each image, report how you feel using a two-dimensional grid (valence × arousal)",
      "Then select from a set of emotion labels the one that best captures your feeling",
      "Finally, rate your confidence in that label from 1 to 4",
    ],
    whatThisMeasures:
      "Meta-emotion refers to the ability to monitor and evaluate one's own emotional states. This task measures emotional clarity — how precisely a person can identify and label their current affective experience.",
    summaryFact:
      "Emotional clarity — knowing what you feel and why — is a core component of emotional intelligence and predicts better mental health outcomes, relationship quality, and emotion regulation success.",
  },
  {
    slug: "emotional-intelligence",
    title: "Emotional Intelligence",
    domain: "Emotion",
    cognitiveAbility: "Emotional Intelligence",
    targetPaper: "Mayer, Salovey & Caruso (2002), JPSP",
    publicationUrl: "https://doi.org/10.1037/0022-3514.83.2.424",
    demoGuidanceMinutes: 6,
    instructionBullets: [
      "You will complete two types of emotional intelligence tasks",
      "First: identify the emotions expressed in facial photographs",
      "Second: answer questions about how emotions work (e.g. what emotion is likely to follow from a situation)",
      "There are consensus-based correct answers — choose the most appropriate response",
    ],
    whatThisMeasures:
      "The ability model of emotional intelligence defines EI as four abilities: perceiving, using, understanding, and managing emotions. This demo covers perceiving and understanding branches.",
    summaryFact:
      "Ability EI — measured via performance tasks rather than self-report — uniquely predicts relationship satisfaction, leadership effectiveness, and wellbeing beyond personality and IQ.",
  },
  {
    slug: "category-learning",
    title: "Beetle Classification",
    domain: "Memory & Learning",
    cognitiveAbility: "Rule Discovery",
    targetPaper: "Goldwater et al.; Allen & Brooks (1991)",
    publicationUrl: "https://doi.org/10.1037/0278-7393.17.1.3",
    demoGuidanceMinutes: 6,
    instructionBullets: [
      "You will be shown images of fictional beetles and asked to classify them as Species A or Species B",
      "After each classification, you will receive feedback (correct / incorrect)",
      "There is a rule that distinguishes the two species — try to find it",
      "After each response, rate your confidence in your classification",
    ],
    whatThisMeasures:
      "How people learn to classify novel objects into categories — whether they discover explicit rules or rely on exemplar similarity. Confidence ratings capture metacognitive monitoring of learning in real time.",
    summaryFact:
      "Rule-based and exemplar-based learning engage different cognitive systems. Metacognitive monitoring during category learning — tracked via confidence ratings — predicts the transition from exemplar reliance to rule-based classification.",
  },
  {
    slug: "analogical-reasoning",
    title: "Analogical Reasoning",
    domain: "Reasoning",
    cognitiveAbility: "Relational Reasoning",
    targetPaper: "Holyoak & Thagard (1989); Vendetti et al. (2014)",
    publicationUrl: "https://doi.org/10.1037/0033-295X.96.2.220",
    demoGuidanceMinutes: 5,
    instructionBullets: [
      'You will see a word pair (e.g. "Hand : Glove")',
      "Choose the word pair from four options that has the same relationship",
      "Some problems use abstract geometric patterns instead of words",
      "Focus on the relationship, not the objects themselves",
    ],
    whatThisMeasures:
      "Analogical reasoning — the ability to identify structural relationships between pairs of concepts and map them to novel domains — is a fundamental cognitive ability underlying language, science, and creative problem solving.",
    summaryFact:
      "Analogical reasoning ability is one of the strongest single-task predictors of academic achievement and is central to scientific discovery — many breakthrough insights in science have the structure of an analogy.",
  },
  {
    slug: "latin-square",
    title: "Latin Square Task",
    domain: "Executive Function",
    cognitiveAbility: "Working Memory / Rule Learning",
    targetPaper: "Gray et al. (2003), Psychological Science",
    publicationUrl: "https://doi.org/10.1111/1467-9280.03436",
    demoGuidanceMinutes: 5,
    instructionBullets: [
      "You will see a 4×4 grid containing coloured shapes",
      "Your task is to place the missing shape so that each row and column contains each shape and colour exactly once",
      "This is like a mini Sudoku, but with shapes and colours",
      "Tap the correct position in the grid for the target shape",
    ],
    whatThisMeasures:
      "The Latin Square Task measures the ability to maintain and integrate multiple rules in working memory simultaneously. It predicts fluid intelligence and executive function capacity.",
    summaryFact:
      "Performance on the Latin Square Task loads heavily on the same factor as Raven's Progressive Matrices and predicts the ability to maintain goal-relevant information in the face of distraction.",
  },
  {
    slug: "relational-monitoring",
    title: "Relational Monitoring",
    domain: "Metacognition",
    cognitiveAbility: "Metacognitive Monitoring",
    targetPaper: "Double & Birney (2019), Consciousness and Cognition",
    publicationUrl: "https://doi.org/10.1016/j.concog.2019.01.002",
    demoGuidanceMinutes: 5,
    instructionBullets: [
      "You will solve a series of reasoning problems",
      "After each answer, rate your confidence that you were correct",
      'Try to be as accurate as possible with your confidence — not just saying "100%" each time',
      "Calibration matters: a good score means your confidence tracks your actual accuracy",
    ],
    whatThisMeasures:
      "The Relational Monitoring Task assesses the accuracy of metacognitive monitoring for relational reasoning problems. It separates first-order performance from the ability to accurately track one's own performance.",
    summaryFact:
      "Metacognitive monitoring accuracy — not just average confidence level — is what distinguishes high from low metacognitive ability. Good monitors know what they know and know what they don't.",
  },
  {
    slug: "tower-of-hanoi",
    title: "Tower of Hanoi",
    domain: "Executive Function",
    cognitiveAbility: "Planning & Problem Solving",
    targetPaper: "Anderson (1993); Berg & Byrd (2002)",
    publicationUrl: "https://doi.org/10.1016/S0022-0965(02)00145-3",
    demoGuidanceMinutes: 6,
    instructionBullets: [
      "Move all discs from the left peg to the right peg",
      "You can only move one disc at a time",
      "A larger disc can never be placed on top of a smaller disc",
      "Try to complete the puzzle in as few moves as possible",
    ],
    whatThisMeasures:
      "The Tower of Hanoi requires planning a sequence of moves to transfer a stack of discs from one peg to another following strict rules. It is a classic measure of planning, inhibition, and working memory.",
    summaryFact:
      "The minimum number of moves to solve an n-disc Tower of Hanoi is 2ⁿ − 1. Strategic planning — not trial-and-error — is the key cognitive demand. Performance correlates with prefrontal cortex function.",
  },
  {
    slug: "task-switching",
    title: "Task Switching",
    domain: "Executive Function",
    cognitiveAbility: "Cognitive Flexibility",
    targetPaper: "Monsell (2003), Trends in Cognitive Sciences",
    publicationUrl: "https://doi.org/10.1016/S1364-6613(03)00028-7",
    demoGuidanceMinutes: 5,
    instructionBullets: [
      "A digit will appear in the centre of the screen",
      "When the box is BLUE, decide if the number is ODD or EVEN",
      "When the box is YELLOW, decide if the number is HIGH (> 5) or LOW (≤ 5)",
      "Respond as quickly and accurately as possible",
    ],
    whatThisMeasures:
      'Task switching paradigms measure the cost of switching between two different classification rules. "Switch cost" — slower and less accurate responses on switch trials — indexes cognitive flexibility.',
    summaryFact:
      "Switch costs — the RT and accuracy penalty on task-switch trials compared to task-repeat trials — are remarkably robust across the lifespan and predict real-world multi-tasking ability and driving safety.",
  },
];

export const GRID_ORDER = [
  "meta-dprime",
  "matrix-reasoning",
  "category-learning",
  "meta-emotion",
  "beer-game",
  "latin-square",
  "emotional-intelligence",
  "complex-problem-solving",
  "tower-of-hanoi",
  "relational-monitoring",
  "analogical-reasoning",
  "task-switching",
];

export function getTaskBySlug(slug: string): TaskConfig | undefined {
  return TASKS.find((t) => t.slug === slug);
}
