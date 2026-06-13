from pydantic import BaseModel, Field
from typing import Literal


class AssessmentAnswerIn(BaseModel):
    question_id: str = Field(min_length=1)
    value: int = Field(ge=1, le=5)


class AssessmentSubmissionIn(BaseModel):
    answers: list[AssessmentAnswerIn]


class TraitInsightOut(BaseModel):
    trait: str
    score: int
    band: str
    description: str


class AssessmentResultOut(BaseModel):
    openness: int
    conscientiousness: int
    extraversion: int
    agreeableness: int
    neuroticism: int
    summary: str
    trait_insights: list[TraitInsightOut] | None = None
    insight_source: Literal["ai", "deterministic"]
