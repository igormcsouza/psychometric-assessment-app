import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssessmentResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type AssessmentSummaryProps = {
  result: AssessmentResult;
};

export const AssessmentSummary = ({ result }: AssessmentSummaryProps) => {
  const percentage = Object.values(result)
    .filter((value): value is number => typeof value === "number")
    .reduce((sum, value) => sum + value, 0) / 5;

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Personality summary</CardTitle>
          <Badge>{Math.round(percentage)}% average intensity</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-muted-foreground">{result.summary}</p>
      </CardContent>
    </Card>
  );
};

