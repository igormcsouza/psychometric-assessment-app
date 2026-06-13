export const TRAIT_KEYS = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism"
] as const;

export type TraitKey = (typeof TRAIT_KEYS)[number];

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export type Question = {
  id: string;
  trait: TraitKey;
  prompt: string;
  reverseScored?: boolean;
  helperText?: string;
};

export type AssessmentAnswer = {
  questionId: string;
  value: LikertValue;
};

export type AssessmentSubmission = {
  answers: AssessmentAnswer[];
};

export type AssessmentResult = Record<TraitKey, number> & {
  summary: string;
  insight_source: "ai" | "deterministic";
};

export type TraitScore = {
  trait: TraitKey;
  score: number;
  title: string;
  description: string;
};

export type TraitMetadata = {
  trait: TraitKey;
  title: string;
  shortLabel: string;
  description: string;
  insight: string;
  colorClass: string;
};
