import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageShell className="justify-center">
      <div className="space-y-6 py-10">
        <Card className="border-border/70 bg-white/85 shadow-sm">
          <CardHeader className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full max-w-3xl" />
            <Skeleton className="h-6 w-full max-w-2xl" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

