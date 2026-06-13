from __future__ import annotations

from collections import defaultdict
from math import fsum
from typing import Final, Mapping, TypedDict

BIG_FIVE_TRAITS: Final[tuple[str, ...]] = (
    "openness",
    "conscientiousness",
    "extraversion",
    "agreeableness",
    "neuroticism",
)

ANSWER_MIN: Final[int] = 1
ANSWER_MAX: Final[int] = 5
SCORE_MIN: Final[int] = 0
SCORE_MAX: Final[int] = 100

class QuestionRule(TypedDict):
    trait: str
    reverse_scored: bool


class AssessmentAnswer(TypedDict):
    question_id: str
    value: int


QUESTION_RULES: Final[dict[str, QuestionRule]] = {
    "q1": {"trait": "openness", "reverse_scored": False},
    "q2": {"trait": "openness", "reverse_scored": False},
    "q3": {"trait": "openness", "reverse_scored": True},
    "q4": {"trait": "openness", "reverse_scored": False},
    "q5": {"trait": "conscientiousness", "reverse_scored": False},
    "q6": {"trait": "conscientiousness", "reverse_scored": False},
    "q7": {"trait": "conscientiousness", "reverse_scored": False},
    "q8": {"trait": "conscientiousness", "reverse_scored": True},
    "q9": {"trait": "extraversion", "reverse_scored": False},
    "q10": {"trait": "extraversion", "reverse_scored": False},
    "q11": {"trait": "extraversion", "reverse_scored": True},
    "q12": {"trait": "extraversion", "reverse_scored": False},
    "q13": {"trait": "agreeableness", "reverse_scored": False},
    "q14": {"trait": "agreeableness", "reverse_scored": False},
    "q15": {"trait": "agreeableness", "reverse_scored": True},
    "q16": {"trait": "agreeableness", "reverse_scored": False},
    "q17": {"trait": "neuroticism", "reverse_scored": False},
    "q18": {"trait": "neuroticism", "reverse_scored": True},
    "q19": {"trait": "neuroticism", "reverse_scored": False},
    "q20": {"trait": "neuroticism", "reverse_scored": True},
}

def _ensure_int(value: object, field_name: str) -> int:
    if type(value) is not int:
        raise ValueError(f"{field_name} must be an integer.")
    return value


def _ensure_question_id(question_id: object) -> str:
    if type(question_id) is not str or not question_id.strip():
        raise ValueError("question_id must be a non-empty string.")
    return question_id


def validate_answer(answer: object) -> AssessmentAnswer:
    if not isinstance(answer, dict):
        raise ValueError("Each answer must be a dictionary.")

    question_id = _ensure_question_id(answer.get("question_id"))
    if question_id not in QUESTION_RULES:
        raise ValueError(f"Unknown question_id: {question_id}")

    value = _ensure_int(answer.get("value"), "value")
    if value < ANSWER_MIN or value > ANSWER_MAX:
        raise ValueError(f"value must be between {ANSWER_MIN} and {ANSWER_MAX}.")

    return {"question_id": question_id, "value": value}


def validate_answers(answers: list[Mapping[str, object]]) -> list[AssessmentAnswer]:
    validated_answers = [validate_answer(answer) for answer in answers]
    question_ids = [answer["question_id"] for answer in validated_answers]

    if len(question_ids) != len(set(question_ids)):
        raise ValueError("Duplicate question_id values are not allowed.")

    return validated_answers


def reverse_score(value: int) -> int:
    validated = _ensure_int(value, "value")
    if validated < ANSWER_MIN or validated > ANSWER_MAX:
        raise ValueError(f"value must be between {ANSWER_MIN} and {ANSWER_MAX}.")
    return ANSWER_MAX + ANSWER_MIN - validated


def normalize_score(value: int, reverse_scored: bool = False) -> int:
    adjusted = reverse_score(value) if reverse_scored else _ensure_int(value, "value")
    normalized = ((adjusted - ANSWER_MIN) / (ANSWER_MAX - ANSWER_MIN)) * SCORE_MAX
    return int(round(normalized))


def group_answers_by_trait(answers: list[AssessmentAnswer]) -> dict[str, list[AssessmentAnswer]]:
    grouped: dict[str, list[AssessmentAnswer]] = defaultdict(list)
    for answer in answers:
        rule = QUESTION_RULES[answer["question_id"]]
        grouped[rule["trait"]].append(answer)
    return dict(grouped)


def score_trait(answers: list[AssessmentAnswer], trait: str) -> int:
    if trait not in BIG_FIVE_TRAITS:
        raise ValueError(f"Unknown trait: {trait}")

    trait_answers = group_answers_by_trait(answers).get(trait, [])
    if not trait_answers:
        raise ValueError(f"Missing answers for trait: {trait}")

    normalized_scores = [
        normalize_score(
            int(answer["value"]),
            bool(QUESTION_RULES[answer["question_id"]]["reverse_scored"]),
        )
        for answer in trait_answers
    ]
    return int(round(fsum(normalized_scores) / len(normalized_scores)))


def calculate_scores(answers: list[Mapping[str, object]]) -> dict[str, int]:
    validated_answers = validate_answers(answers)

    scores = {
        trait: score_trait(validated_answers, trait)
        for trait in BIG_FIVE_TRAITS
    }
    return scores
