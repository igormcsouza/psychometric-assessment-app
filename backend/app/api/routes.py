from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from app.api.schemas import AssessmentResultOut, AssessmentSubmissionIn
from app.services.interpretation import interpret_scores
from app.services.scoring import calculate_scores

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/assessment", response_model=AssessmentResultOut)
def submit_assessment(payload: AssessmentSubmissionIn) -> AssessmentResultOut:
    try:
        answers = [answer.model_dump() for answer in payload.answers]
        logger.debug("Assessment submission received with %s answers.", len(answers))
        logger.debug("Assessment answers payload: %s", answers)
        scores = calculate_scores(answers)
        logger.debug("Calculated assessment scores: %s", scores)
    except ValueError as exc:
        logger.warning("Assessment submission rejected: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    interpretation = interpret_scores(scores)
    logger.debug(
        "Assessment interpretation generated with source=%s.",
        interpretation.get("insight_source", "unknown"),
    )
    logger.debug("Assessment interpretation payload: %s", interpretation)
    return AssessmentResultOut(**scores, **interpretation)
