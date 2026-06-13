from __future__ import annotations

import json
import logging
import os
from typing import Final

from openai import OpenAI, OpenAIError

from app.services.scoring import BIG_FIVE_TRAITS

DEFAULT_OPENAI_MODEL: Final[str] = "gpt-5.5"
DEFAULT_TIMEOUT_SECONDS: Final[float] = 15.0
ALLOWED_BANDS: Final[set[str]] = {"low", "moderate", "high"}

logger = logging.getLogger(__name__)

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


def _get_openai_api_key() -> str | None:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    return api_key or None


def _get_openai_model() -> str:
    model = os.getenv("OPENAI_MODEL", "").strip()
    return model or DEFAULT_OPENAI_MODEL


def _get_timeout_seconds() -> float:
    raw_timeout = os.getenv("OPENAI_TIMEOUT_SECONDS", "").strip()
    if not raw_timeout:
        return DEFAULT_TIMEOUT_SECONDS

    try:
        timeout = float(raw_timeout)
    except ValueError:
        return DEFAULT_TIMEOUT_SECONDS

    return timeout if timeout > 0 else DEFAULT_TIMEOUT_SECONDS


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


def _build_messages(scores: dict[str, int]) -> list[dict[str, str]]:
    score_block = "\n".join(f"- {TRAIT_LABELS[trait]}: {scores[trait]}%" for trait in BIG_FIVE_TRAITS)
    instructions = (
        "You are interpreting a Big Five personality assessment.\n"
        "Return only valid JSON with this shape:\n"
        "{\n"
        '  "summary": "string",\n'
        '  "trait_insights": [\n'
        "    {\n"
        '      "trait": "openness | conscientiousness | extraversion | agreeableness | neuroticism",\n'
        '      "score": 0,\n'
        '      "band": "low | moderate | high",\n'
        '      "description": "string"\n'
        "    }\n"
        "  ]\n"
        "}\n"
        "Use the score values as the source of truth.\n"
        "Do not mention that you are an AI.\n"
        "Keep the summary concise, balanced, and suitable for an interview demo.\n"
        "It should be at least 500 characters long.\n"
        "Do not add markdown or code fences."
    )

    user_content = (
        "Interpret these score results:\n"
        f"{score_block}\n\n"
        "Helpful trait context:\n"
        + "\n".join(f"- {TRAIT_LABELS[trait]}: {TRAIT_DESCRIPTIONS[trait]}" for trait in BIG_FIVE_TRAITS)
    )

    return [
        {"role": "system", "content": instructions},
        {"role": "user", "content": user_content},
    ]


def _build_json_schema() -> dict[str, object]:
    return {
        "type": "json_schema",
        "name": "assessment_insight",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "summary": {
                    "type": "string",
                    "description": "A concise, balanced summary of the profile.",
                    "minLength": 500
                },
                "trait_insights": {
                    "type": "array",
                    "minItems": len(BIG_FIVE_TRAITS),
                    "maxItems": len(BIG_FIVE_TRAITS),
                    "items": {
                        "type": "object",
                        "properties": {
                            "trait": {
                                "type": "string",
                                "enum": list(BIG_FIVE_TRAITS),
                            },
                            "score": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100,
                            },
                            "band": {
                                "type": "string",
                                "enum": sorted(ALLOWED_BANDS),
                            },
                            "description": {
                                "type": "string",
                                "description": "One concise insight sentence per trait.",
                            },
                        },
                        "required": ["trait", "score", "band", "description"],
                        "additionalProperties": False,
                    },
                },
            },
            "required": ["summary", "trait_insights"],
            "additionalProperties": False,
        },
    }


def _build_request_payload(scores: dict[str, int]) -> dict[str, object]:
    score_block = "\n".join(f"- {TRAIT_LABELS[trait]}: {scores[trait]}%" for trait in BIG_FIVE_TRAITS)
    return {
        "model": _get_openai_model(),
        "reasoning": {"effort": "low"},
        "instructions": (
            "You are interpreting a Big Five personality assessment.\n"
            "Use the provided scores as the source of truth.\n"
            "Keep the summary concise, balanced, and suitable for an interview demo.\n"
            "Do not mention that you are an AI.\n"
            "It should be at least 500 characters long.\n"
            "Do not add markdown or code fences."
        ),
        "input": (
            "Interpret these score results:\n"
            f"{score_block}\n\n"
            "Helpful trait context:\n"
            + "\n".join(f"- {TRAIT_LABELS[trait]}: {TRAIT_DESCRIPTIONS[trait]}" for trait in BIG_FIVE_TRAITS)
        ),
        "text": {
            "format": _build_json_schema(),
        },
    }


def _extract_output_text(response_body: dict[str, object]) -> str:
    output_text = response_body.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text

    output = response_body.get("output")
    if not isinstance(output, list):
        raise ValueError("OpenAI response missing output.")

    for output_item in output:
        if not isinstance(output_item, dict):
            continue
        content = output_item.get("content")
        if not isinstance(content, list):
            continue
        for content_item in content:
            if not isinstance(content_item, dict):
                continue
            if content_item.get("type") == "output_text":
                text = content_item.get("text")
                if isinstance(text, str) and text.strip():
                    return text

    raise ValueError("OpenAI response did not include text content.")


def _validate_ai_interpretation(payload: object) -> dict[str, object]:
    if not isinstance(payload, dict):
        raise ValueError("OpenAI interpretation must be a JSON object.")

    summary = payload.get("summary")
    trait_insights = payload.get("trait_insights")

    if not isinstance(summary, str) or not summary.strip():
        raise ValueError("OpenAI interpretation summary is invalid.")

    if not isinstance(trait_insights, list) or len(trait_insights) != len(BIG_FIVE_TRAITS):
        raise ValueError("OpenAI interpretation trait_insights is invalid.")

    validated_trait_insights: dict[str, dict[str, str | int]] = {}

    for item in trait_insights:
        if not isinstance(item, dict):
            raise ValueError("OpenAI trait insight item is invalid.")

        trait = item.get("trait")
        score = item.get("score")
        band = item.get("band")
        description = item.get("description")

        if trait not in BIG_FIVE_TRAITS:
            raise ValueError("OpenAI trait insight contains an unknown trait.")
        if trait in validated_trait_insights:
            raise ValueError("OpenAI trait insight contains duplicate traits.")
        if type(score) is not int or score < 0 or score > 100:
            raise ValueError("OpenAI trait insight score is invalid.")
        if band not in ALLOWED_BANDS:
            raise ValueError("OpenAI trait insight band is invalid.")
        if not isinstance(description, str) or not description.strip():
            raise ValueError("OpenAI trait insight description is invalid.")

        validated_trait_insights[trait] = {
            "trait": trait,
            "score": score,
            "band": band,
            "description": description,
        }

    if set(validated_trait_insights.keys()) != set(BIG_FIVE_TRAITS):
        raise ValueError("OpenAI trait insight set is incomplete.")

    return {
        "summary": summary.strip(),
        "trait_insights": [validated_trait_insights[trait] for trait in BIG_FIVE_TRAITS],
    }


def generate_ai_interpretation(scores: dict[str, int]) -> dict[str, object] | None:
    api_key = _get_openai_api_key()
    if not api_key:
        logger.debug("OPENAI_API_KEY is not set; using deterministic fallback.")
        return None

    client = OpenAI(api_key=api_key, timeout=_get_timeout_seconds())

    try:
        response = client.responses.create(**_build_request_payload(scores))
    except OpenAIError as exc:
        logger.warning("OpenAI insight request failed; using deterministic fallback.", exc_info=exc)
        return None

    try:
        content = _extract_output_text(response.model_dump())
        parsed_content = json.loads(content)
        return _validate_ai_interpretation(parsed_content)
    except (ValueError, json.JSONDecodeError) as exc:
        logger.warning("OpenAI insight response was invalid; using deterministic fallback.", exc_info=exc)
        return None
