import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TRAIT_METADATA } from "@/lib/questions";
import type { TraitScore } from "@/lib/types";
import { cn } from "@/lib/utils";

type TraitCardProps = {
  traitScore: TraitScore;
};

export const TraitCard = ({ traitScore }: TraitCardProps) => {
  const metadata = TRAIT_METADATA[traitScore.trait];

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className={cn("h-1.5 w-16 rounded-full bg-gradient-to-r", metadata.colorClass)} />
        <CardTitle className="flex items-center justify-between gap-4 text-base">
          <span>{traitScore.title}</span>
          <span className="text-sm text-muted-foreground">{traitScore.score}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={traitScore.score} />
        <p className="text-sm leading-6 text-muted-foreground">{traitScore.description}</p>
      </CardContent>
    </Card>
  );
};

