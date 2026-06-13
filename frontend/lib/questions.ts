import type { Question, TraitKey, TraitMetadata } from "@/lib/types";

export const TRAIT_METADATA: Record<TraitKey, TraitMetadata> = {
  openness: {
    trait: "openness",
    title: "Openness",
    shortLabel: "Open",
    description:
      "Curiosity, creativity, and comfort with abstract thinking and novelty.",
    insight:
      "High openness often shows up as curiosity, imagination, and a strong preference for variety.",
    colorClass: "from-sky-500 to-cyan-400"
  },
  conscientiousness: {
    trait: "conscientiousness",
    title: "Conscientiousness",
    shortLabel: "Disciplined",
    description:
      "Organization, reliability, planning, and follow-through under pressure.",
    insight:
      "High conscientiousness tends to correlate with structure, persistence, and strong execution.",
    colorClass: "from-emerald-500 to-teal-400"
  },
  extraversion: {
    trait: "extraversion",
    title: "Extraversion",
    shortLabel: "Social",
    description:
      "Energy from social interaction, assertiveness, and outward expression.",
    insight:
      "Higher extraversion usually reflects comfort with visibility, momentum, and social stimulation.",
    colorClass: "from-amber-500 to-orange-400"
  },
  agreeableness: {
    trait: "agreeableness",
    title: "Agreeableness",
    shortLabel: "Cooperative",
    description:
      "Trust, empathy, compassion, and a collaborative interpersonal style.",
    insight:
      "High agreeableness often appears as warmth, tact, and a preference for harmony.",
    colorClass: "from-violet-500 to-fuchsia-400"
  },
  neuroticism: {
    trait: "neuroticism",
    title: "Neuroticism",
    shortLabel: "Sensitive",
    description:
      "Emotional volatility, stress sensitivity, and tendency toward negative affect.",
    insight:
      "Higher neuroticism can reflect stronger emotional reactivity and a need for steadier routines.",
    colorClass: "from-rose-500 to-pink-400"
  }
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: "q1",
    trait: "openness",
    prompt: "I enjoy exploring ideas that challenge the way I usually think.",
    helperText: "Think about your comfort with new perspectives."
  },
  {
    id: "q2",
    trait: "openness",
    prompt: "I am drawn to art, culture, or creative expression.",
    helperText: "This includes both making and appreciating creative work."
  },
  {
    id: "q3",
    trait: "openness",
    prompt: "I prefer familiar routines over experimenting with new approaches.",
    reverseScored: true
  },
  {
    id: "q4",
    trait: "openness",
    prompt: "I like conversations that stretch my thinking.",
    helperText: "For example, conversations about ideas, systems, or possibilities."
  },
  {
    id: "q5",
    trait: "conscientiousness",
    prompt: "I usually keep my commitments and deadlines."
  },
  {
    id: "q6",
    trait: "conscientiousness",
    prompt: "I plan ahead instead of waiting until the last minute."
  },
  {
    id: "q7",
    trait: "conscientiousness",
    prompt: "My work area and digital files tend to stay organized."
  },
  {
    id: "q8",
    trait: "conscientiousness",
    prompt: "I often act impulsively without thinking through consequences.",
    reverseScored: true
  },
  {
    id: "q9",
    trait: "extraversion",
    prompt: "I feel energized after spending time with other people."
  },
  {
    id: "q10",
    trait: "extraversion",
    prompt: "I am comfortable speaking up in a group.",
    helperText: "Even when the group is unfamiliar."
  },
  {
    id: "q11",
    trait: "extraversion",
    prompt: "I prefer quiet, solo activities over social ones.",
    reverseScored: true
  },
  {
    id: "q12",
    trait: "extraversion",
    prompt: "I naturally take the lead when a group needs direction."
  },
  {
    id: "q13",
    trait: "agreeableness",
    prompt: "I try to understand other people's points of view before reacting."
  },
  {
    id: "q14",
    trait: "agreeableness",
    prompt: "I usually assume people have good intentions."
  },
  {
    id: "q15",
    trait: "agreeableness",
    prompt: "I can be blunt even when a softer approach would help.",
    reverseScored: true
  },
  {
    id: "q16",
    trait: "agreeableness",
    prompt: "I am willing to help even when I am busy."
  },
  {
    id: "q17",
    trait: "neuroticism",
    prompt: "I often worry that something will go wrong."
  },
  {
    id: "q18",
    trait: "neuroticism",
    prompt: "I stay calm even when plans change suddenly.",
    reverseScored: true
  },
  {
    id: "q19",
    trait: "neuroticism",
    prompt: "Small setbacks affect my mood for a while."
  },
  {
    id: "q20",
    trait: "neuroticism",
    prompt: "I usually recover quickly after stressful situations.",
    reverseScored: true
  }
];

export const TRAIT_ORDER: TraitKey[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism"
];
