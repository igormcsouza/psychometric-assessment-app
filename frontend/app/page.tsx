import { Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/shared/page-shell";
import { StartAssessmentButton } from "@/components/shared/start-assessment-button";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Clock3,
    title: "5 minutes",
    description: "A compact 20-question experience that respects the candidate's time."
  },
  {
    icon: ShieldCheck,
    title: "Session-only",
    description: "Results stay in memory for the current browsing session only."
  },
  {
    icon: Sparkles,
    title: "Big Five aligned",
    description: "Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
  }
];

export default function HomePage() {
  return (
    <PageShell className="justify-center">
      <section className="grid gap-10 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16 lg:py-14">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Portfolio-ready Big Five assessment
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A clean psychometric assessment experience built for thoughtful hiring conversations.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Explore personality patterns through a modern, accessible OCEAN assessment with
              intuitive navigation, instant scoring, and session-only results.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <StartAssessmentButton />
            <Button asChild size="lg" variant="outline" className="rounded-2xl">
              <a href="#model">Learn about the model</a>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <Card key={highlight.title} className="border-border/70 bg-white/85 shadow-sm">
                  <CardHeader className="space-y-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{highlight.title}</CardTitle>
                    <CardDescription>{highlight.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="relative overflow-hidden border-border/70 bg-slate-950 text-white shadow-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_34%)]" />
          <CardHeader className="relative space-y-4">
            <CardTitle className="text-2xl text-white">The Big Five model</CardTitle>
            <CardDescription className="max-w-md text-slate-300">
              A research-backed framework that describes personality across five broad dimensions.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {[
              "Openness: curiosity and imagination",
              "Conscientiousness: planning and dependability",
              "Extraversion: energy and social engagement",
              "Agreeableness: empathy and cooperation",
              "Neuroticism: emotional sensitivity"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="model" className="py-4 pb-10">
        <Card className="border-border/70 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle>What to expect</CardTitle>
            <CardDescription>
              The assessment is designed to feel polished, lightweight, and easy to review in an interview setting.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              "One question at a time with clear progress tracking",
              "Mobile-friendly controls and accessible contrast",
              "Readable output with charts, traits, and summary context"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
