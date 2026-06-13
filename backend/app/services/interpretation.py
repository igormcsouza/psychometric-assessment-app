from __future__ import annotations

from typing import Final

from app.services.ai_insights import generate_ai_interpretation
from app.services.scoring import BIG_FIVE_TRAITS

TRAIT_LABELS: Final[dict[str, str]] = {
    "openness": "Openness",
    "conscientiousness": "Conscientiousness",
    "extraversion": "Extraversion",
    "agreeableness": "Agreeableness",
    "neuroticism": "Neuroticism",
}

TRAIT_DESCRIPTIONS: Final[dict[str, str]] = {
    "openness": "Curiosity, creativity, and comfort with novelty.",
    "conscientiousness": "Planning, reliability, and follow-through.",
    "extraversion": "Energy from social interaction and outward expression.",
    "agreeableness": "Warmth, trust, and cooperation with others.",
    "neuroticism": "Emotional sensitivity and stress reactivity.",
}

def classify_band(score: int) -> str:
    if score >= 75:
        return "high"
    if score >= 40:
        return "moderate"
    return "low"


def build_trait_insight(trait: str, score: int) -> dict[str, str | int]:
    band = classify_band(score)
    if band == "high":
        descriptor = "notable strength"
    elif band == "moderate":
        descriptor = "balanced tendency"
    else:
        descriptor = "lower relative tendency"

    return {
        "trait": trait,
        "score": score,
        "band": band,
        "description": f"{TRAIT_LABELS[trait]} appears as a {descriptor}. {TRAIT_DESCRIPTIONS[trait]}",
    }


def build_summary(scores: dict[str, int]) -> str:
    ordered_traits = sorted(BIG_FIVE_TRAITS, key=lambda trait: scores[trait], reverse=True)
    strongest = ordered_traits[0]
    weakest = ordered_traits[-1]

    return (
        f"Your strongest trait is {TRAIT_LABELS[strongest].lower()}, while "
        f"{TRAIT_LABELS[weakest].lower()} is comparatively lower. "
        "Use this profile as a reflection tool rather than a fixed label."
    )


def build_deterministic_interpretation(scores: dict[str, int]) -> dict[str, object]:
    trait_insights = [build_trait_insight(trait, scores[trait]) for trait in BIG_FIVE_TRAITS]
    return {
        "summary": build_summary(scores),
        "trait_insights": trait_insights,
        "insight_source": "deterministic",
    }


def interpret_scores(scores: dict[str, int]) -> dict[str, object]:
    if set(scores.keys()) != set(BIG_FIVE_TRAITS):
        missing = sorted(set(BIG_FIVE_TRAITS) - set(scores.keys()))
        raise ValueError(f"Missing scores for traits: {', '.join(missing)}")

    ai_interpretation = generate_ai_interpretation(scores)
    if ai_interpretation is not None:
        return {
            **ai_interpretation,
            "insight_source": "ai",
        }

    return build_deterministic_interpretation(scores)
