export type CognitiveDomain =
  | "Metacognition"
  | "Reasoning"
  | "Emotion"
  | "Memory & Learning"
  | "Executive Function";

export const DOMAIN_COLOURS: Record<CognitiveDomain, string> = {
  Metacognition: "#4A7C9E",
  Reasoning: "#7B6CA8",
  Emotion: "#B85C5C",
  "Memory & Learning": "#5A8C6A",
  "Executive Function": "#C4874A",
};
