import pytest

from app.services.interpretation import build_summary, classify_band, interpret_scores


def test_classify_band():
    assert classify_band(80) == "high"
    assert classify_band(55) == "moderate"
    assert classify_band(20) == "low"


def test_build_summary_uses_extremes():
    summary = build_summary(
        {
            "openness": 82,
            "conscientiousness": 74,
            "extraversion": 67,
            "agreeableness": 88,
            "neuroticism": 31,
        }
    )

    assert "agreeableness" in summary
    assert "neuroticism" in summary


def test_interpret_scores_rejects_missing_traits():
    with pytest.raises(ValueError, match="Missing scores for traits"):
        interpret_scores({"openness": 1})


def test_interpret_scores_uses_deterministic_fallback_without_openai_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    result = interpret_scores(
        {
            "openness": 82,
            "conscientiousness": 74,
            "extraversion": 67,
            "agreeableness": 88,
            "neuroticism": 31,
        }
    )

    assert result["summary"].startswith("Your strongest trait is agreeableness")
    assert len(result["trait_insights"]) == 5
