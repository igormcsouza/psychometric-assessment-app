import { TRAIT_METADATA, TRAIT_ORDER } from "@/lib/questions";
import type { AssessmentResult, TraitScore } from "@/lib/types";

export const buildTraitScores = (result: AssessmentResult): TraitScore[] =>
  TRAIT_ORDER.map((trait) => ({
    trait,
    score: result[trait],
    title: TRAIT_METADATA[trait].title,
    description: TRAIT_METADATA[trait].description
  }));

export const buildPersonalityInsights = (result: AssessmentResult): string[] => {
  const sorted = [...TRAIT_ORDER].sort((left, right) => result[right] - result[left]);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  return [
    `${TRAIT_METADATA[highest].title} stands out as a defining strength in this profile.`,
    `${TRAIT_METADATA[lowest].title} is relatively lower, which may show up as a more balanced or guarded style in that area.`,
    "This profile is most useful when paired with context, goals, and the situations where you are at your best."
  ];
};
