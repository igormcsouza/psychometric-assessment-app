"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageShell } from "@/components/shared/page-shell";

export default function GlobalError({
  reset
}: {
  reset: () => void;
}) {
  return (
    <PageShell className="justify-center">
      <Card className="mx-auto max-w-xl border-border/70 bg-white/90 text-center shadow-soft">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription>
            We could not render this screen. You can retry or return to the home page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button className="rounded-2xl" onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
