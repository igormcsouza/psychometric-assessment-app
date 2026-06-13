import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Question } from "@/lib/types";
import { TRAIT_METADATA } from "@/lib/questions";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

type QuestionCardProps = {
  question: Question;
  totalQuestions: number;
  currentIndex: number;
  children: ReactNode;
};

export const QuestionCard = ({ question, totalQuestions, currentIndex, children }: QuestionCardProps) => {
  const trait = TRAIT_METADATA[question.trait];

  return (
    <Card className="overflow-hidden border-border/70 bg-white/90 shadow-soft backdrop-blur">
      <CardHeader className="space-y-4 border-b border-border/60 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between gap-4">
          <Badge className="border-0 bg-slate-900 text-white">{trait.title}</Badge>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-2xl leading-tight sm:text-3xl">{question.prompt}</CardTitle>
        <CardDescription className="max-w-2xl">
          {question.helperText ?? trait.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">{children}</CardContent>
      <Separator />
      <CardContent className="flex items-center justify-between py-4 text-sm text-muted-foreground">
        <span>Answer honestly for the most useful reflection.</span>
        <span>{trait.shortLabel}</span>
      </CardContent>
    </Card>
  );
};
