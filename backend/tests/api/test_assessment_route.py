from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_assessment_route_returns_scores_and_summary():
    response = client.post(
        "/assessment",
        json={
            "answers": [
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
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["openness"] == 90
    assert data["summary"]
    assert len(data["trait_insights"]) == 5

