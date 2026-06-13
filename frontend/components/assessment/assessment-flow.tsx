"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ASSESSMENT_QUESTIONS } from "@/lib/questions";
import type { AssessmentSubmission, LikertValue } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/shared/page-shell";
import { ProgressIndicator } from "@/components/assessment/progress-indicator";
import { QuestionCard } from "@/components/assessment/question-card";
import { LikertScale } from "@/components/assessment/likert-scale";
import { useAssessmentSession } from "@/hooks/use-assessment-session";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const responseSchema = z
  .object({
    response: z.number().int().min(1).max(5).optional()
  })
  .refine((data) => data.response !== undefined, {
    path: ["response"],
    message: "Choose a response to continue."
  });

type ResponseForm = z.infer<typeof responseSchema>;

const upsertAnswer = (
  answers: AssessmentSubmission["answers"],
  questionId: string,
  value: LikertValue
) => {
  const filtered = answers.filter((answer) => answer.questionId !== questionId);
  return [...filtered, { questionId, value }];
};

export const AssessmentFlow = () => {
  const router = useRouter();
  const { answers, error, isSubmitting, setAnswer, submit } = useAssessmentSession();
  const [currentIndex, setCurrentIndex] = useState(0);

  const question = ASSESSMENT_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === ASSESSMENT_QUESTIONS.length - 1;
  const currentAnswer = useMemo(
    () => answers.find((answer) => answer.questionId === question.id),
    [answers, question.id]
  );

  const form = useForm<ResponseForm>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: currentAnswer?.value
    }
  });

  useEffect(() => {
    form.reset({
      response: currentAnswer?.value
    });
  }, [currentAnswer?.value, form, question.id]);

  const handleNext = form.handleSubmit(async ({ response }) => {
    if (response === undefined) {
      return;
    }

    const nextValue = response as LikertValue;
    const nextAnswers = upsertAnswer(answers, question.id, nextValue);

    setAnswer(question.id, nextValue);

    if (isLastQuestion) {
      try {
        await submit({ answers: nextAnswers });
        router.push("/results");
      } catch {
        return;
      }
      return;
    }

    setCurrentIndex((value) => Math.min(value + 1, ASSESSMENT_QUESTIONS.length - 1));
  });

  const handlePrevious = () => {
    setCurrentIndex((value) => Math.max(value - 1, 0));
  };

  const answeredCount = answers.length;

  return (
    <PageShell className="gap-8 py-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Big Five assessment
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Answer one question at a time
              </h1>
            </div>
            <Badge className="hidden border-0 bg-emerald-500 text-white sm:inline-flex">
              Session only
            </Badge>
          </div>

          <ProgressIndicator current={currentIndex + 1} total={ASSESSMENT_QUESTIONS.length} />

          {error ? (
            <div
              className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          <QuestionCard
            question={question}
            totalQuestions={ASSESSMENT_QUESTIONS.length}
            currentIndex={currentIndex}
          >
            <form onSubmit={handleNext} className="space-y-6">
              <LikertScale
                name={question.prompt}
                value={form.watch("response") as LikertValue | undefined}
                onChange={(value) => {
                  form.setValue("response", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                  });
                }}
              />

              {form.formState.errors.response ? (
                <p className="text-sm text-rose-600">{form.formState.errors.response.message}</p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0 || isSubmitting}
                  className="rounded-2xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-2xl px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Calculating
                      </>
                    ) : isLastQuestion ? (
                      "Submit assessment"
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </QuestionCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <Card className="border-border/70 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Assessment status</CardTitle>
              <CardDescription>
                You have answered {answeredCount} of {ASSESSMENT_QUESTIONS.length} questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
                Your answers are kept in memory for this session only. Refreshing the page will clear
                the results.
              </div>
              <div className="rounded-2xl border border-border/70 bg-slate-950 p-4 text-sm leading-6 text-white">
                Tip: choose the response that best reflects your typical behavior, not the answer
                that sounds ideal.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-white">Need to restart?</CardTitle>
              <CardDescription className="text-slate-300">
                You can leave the flow at any time and start again without losing anything permanent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full rounded-2xl">
                <Link href="/">Back to home</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </PageShell>
  );
};
