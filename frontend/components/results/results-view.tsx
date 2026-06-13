"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/shared/page-shell";
import { RadarChartCard } from "@/components/charts/radar-chart-card";
import { TraitCard } from "@/components/results/trait-card";
import { AssessmentSummary } from "@/components/results/assessment-summary";
import { useAssessmentSession } from "@/hooks/use-assessment-session";
import { buildPersonalityInsights, buildTraitScores } from "@/lib/scoring";
import { TRAIT_METADATA } from "@/lib/questions";

export const ResultsView = () => {
  const { clearSession, result } = useAssessmentSession();

  const insights = useMemo(() => (result ? buildPersonalityInsights(result) : []), [result]);
  const traitScores = useMemo(() => (result ? buildTraitScores(result) : []), [result]);

  if (!result) {
    return (
      <PageShell className="justify-center py-10">
        <Card className="mx-auto max-w-2xl border-border/70 bg-white/90 text-center shadow-soft">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">No results yet</CardTitle>
            <CardDescription className="mx-auto max-w-lg">
              Complete the assessment to view your Big Five profile. Results only exist in the
              current session and are not stored anywhere.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-2xl">
              <Link href="/assessment">
                Start assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={clearSession}>
              Reset session
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell className="gap-8 py-8">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Assessment complete
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your Big Five profile
              </h1>
              <Badge className="w-fit border-0 bg-slate-900 text-white">
                {result.insight_source === "ai"
                  ? "AI-generated insight"
                  : "Deterministic fallback"}
              </Badge>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              This profile is session-only and meant to support discussion, not to define you
              permanently.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/assessment" onClick={clearSession}>
                Retake assessment
              </Link>
            </Button>
            <Button asChild className="rounded-2xl">
              <Link href="/">
                Back home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <RadarChartCard result={result} />
        <AssessmentSummary result={result} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {traitScores.map((traitScore) => (
          <TraitCard key={traitScore.trait} traitScore={traitScore} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="border-border/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Personality insights</CardTitle>
            <CardDescription>
              These take the raw scores and translate them into a concise, interview-friendly readout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={insight}
                className="flex gap-4 rounded-2xl border border-border/70 bg-muted/30 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-white">Trait descriptions</CardTitle>
            <CardDescription className="text-slate-300">
              A quick reference for what each dimension represents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.values(TRAIT_METADATA).map((trait) => (
              <div key={trait.trait} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{trait.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{trait.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
};
