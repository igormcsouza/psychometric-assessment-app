import { z } from "zod";
import type { AssessmentResult, AssessmentSubmission } from "@/lib/types";

const assessmentSubmissionSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      value: z.number().int().min(1).max(5)
    })
  )
});

const assessmentWireSubmissionSchema = z.object({
  answers: z.array(
    z.object({
      question_id: z.string().min(1),
      value: z.number().int().min(1).max(5)
    })
  )
});

const assessmentResultSchema = z.object({
  openness: z.number().int().min(0).max(100),
  conscientiousness: z.number().int().min(0).max(100),
  extraversion: z.number().int().min(0).max(100),
  agreeableness: z.number().int().min(0).max(100),
  neuroticism: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  insight_source: z.enum(["ai", "deterministic"])
});

export const submitAssessment = async (
  submission: AssessmentSubmission
): Promise<AssessmentResult> => {
  const parsedSubmission = assessmentSubmissionSchema.parse(submission);
  const wireSubmission = assessmentWireSubmissionSchema.parse({
    answers: parsedSubmission.answers.map((answer) => ({
      question_id: answer.questionId,
      value: answer.value
    }))
  });

  const apiUrl = process.env.NEXT_PUBLIC_ASSESSMENT_API_URL;
  if (!apiUrl) {
    throw new Error("Unable to submit the assessment right now.");
  }

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/assessment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(wireSubmission)
    });

    if (!response.ok) {
      throw new Error("Unable to submit the assessment right now.");
    }

    const payload: unknown = await response.json();
    return assessmentResultSchema.parse(payload);
  } catch {
    throw new Error("Unable to submit the assessment right now.");
  }
};
