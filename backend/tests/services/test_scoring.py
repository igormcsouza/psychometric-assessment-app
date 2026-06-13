import pytest

from app.services.scoring import (
    BIG_FIVE_TRAITS,
    calculate_scores,
    normalize_score,
    reverse_score,
    score_trait,
    validate_answer,
)


def test_reverse_score():
    assert reverse_score(1) == 5
    assert reverse_score(2) == 4
    assert reverse_score(3) == 3


def test_normalize_score():
    assert normalize_score(1) == 0
    assert normalize_score(3) == 50
    assert normalize_score(5) == 100


def test_normalize_score_with_reverse_scoring():
    assert normalize_score(1, reverse_scored=True) == 100
    assert normalize_score(5, reverse_scored=True) == 0


def test_validate_answer_rejects_unknown_question():
    with pytest.raises(ValueError, match="Unknown question_id"):
        validate_answer({"question_id": "q999", "value": 4})


def test_validate_answer_rejects_out_of_range_value():
    with pytest.raises(ValueError, match="between 1 and 5"):
        validate_answer({"question_id": "q1", "value": 7})


def test_validate_answer_rejects_non_integer_value():
    with pytest.raises(ValueError, match="must be an integer"):
        validate_answer({"question_id": "q1", "value": 4.5})


def test_calculate_scores_rejects_duplicate_question_ids():
    with pytest.raises(ValueError, match="Duplicate question_id values"):
        calculate_scores(
            [
                {"question_id": "q1", "value": 5},
                {"question_id": "q1", "value": 4},
                {"question_id": "q2", "value": 4},
                {"question_id": "q3", "value": 1},
            ]
        )


def test_score_trait_calculates_average_for_openess():
    answers = [
        {"question_id": "q1", "value": 5},
        {"question_id": "q2", "value": 4},
        {"question_id": "q3", "value": 1},
        {"question_id": "q4", "value": 4},
    ]
    assert score_trait([validate_answer(answer) for answer in answers], "openness") == 90


def test_score_trait_rejects_missing_trait_answers():
    with pytest.raises(ValueError, match="Missing answers for trait"):
        score_trait([], "openness")


def test_calculate_scores_rejects_incomplete_submissions():
    with pytest.raises(ValueError, match="Missing answers for trait"):
        calculate_scores(
            [
                {"question_id": "q1", "value": 5},
                {"question_id": "q2", "value": 4},
            ]
        )


def test_calculate_scores_returns_all_big_five_traits():
    answers = [
        {"question_id": "q1", "value": 5},
        {"question_id": "q2", "value": 4},
        {"question_id": "q3", "value": 1},
        {"question_id": "q4", "value": 4},
        {"question_id": "q5", "value": 4},
        {"question_id": "q6", "value": 4},
        {"question_id": "q7", "value": 5},
        {"question_id": "q8", "value": 2},
        {"question_id": "q9", "value": 4},
        {"question_id": "q10", "value": 4},
        {"question_id": "q11", "value": 2},
        {"question_id": "q12", "value": 4},
        {"question_id": "q13", "value": 5},
        {"question_id": "q14", "value": 4},
        {"question_id": "q15", "value": 1},
        {"question_id": "q16", "value": 5},
        {"question_id": "q17", "value": 2},
        {"question_id": "q18", "value": 4},
        {"question_id": "q19", "value": 2},
        {"question_id": "q20", "value": 5},
    ]

    scores = calculate_scores(answers)

    assert set(scores.keys()) == set(BIG_FIVE_TRAITS)
    assert scores["openness"] == 90
    assert scores["conscientiousness"] == 90
    assert scores["extraversion"] == 85
    assert scores["agreeableness"] == 95
    assert scores["neuroticism"] == 10
