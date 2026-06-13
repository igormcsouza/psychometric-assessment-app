import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ProgressIndicatorProps = {
  current: number;
  total: number;
  className?: string;
};

export const ProgressIndicator = ({ current, total, className }: ProgressIndicatorProps) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {current} of {total}
        </span>
        <span>{percent}% complete</span>
      </div>
      <Progress value={percent} />
    </div>
  );
};

