"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { submitAssessment } from "@/lib/api";
import type { AssessmentAnswer, AssessmentResult, AssessmentSubmission, LikertValue } from "@/lib/types";

type AssessmentSessionState = {
  answers: AssessmentAnswer[];
  result: AssessmentResult | null;
  isSubmitting: boolean;
  error: string | null;
  setAnswer: (questionId: string, value: LikertValue) => void;
  clearSession: () => void;
  submit: (submission?: AssessmentSubmission) => Promise<AssessmentResult>;
};

const AssessmentSessionContext = createContext<AssessmentSessionState | null>(null);

export const AssessmentSessionProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAnswer = (questionId: string, value: LikertValue) => {
    setAnswers((current) => {
      const existing = current.filter((answer) => answer.questionId !== questionId);
      return [...existing, { questionId, value }];
    });
  };

  const clearSession = () => {
    setAnswers([]);
    setResult(null);
    setError(null);
    setIsSubmitting(false);
  };

  const submit = async (submission?: AssessmentSubmission) => {
    const payload = submission ?? { answers };

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitAssessment(payload);
      setResult(response);
      return response;
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : "Something went wrong.";
      setError(message);
      throw submissionError;
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = useMemo(
    () => ({ answers, result, isSubmitting, error, setAnswer, clearSession, submit }),
    [answers, error, isSubmitting, result]
  );

  return <AssessmentSessionContext.Provider value={value}>{children}</AssessmentSessionContext.Provider>;
};

export const useAssessmentSession = () => {
  const context = useContext(AssessmentSessionContext);
  if (!context) {
    throw new Error("useAssessmentSession must be used within AssessmentSessionProvider.");
  }

  return context;
};

