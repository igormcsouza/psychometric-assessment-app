"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssessmentSession } from "@/hooks/use-assessment-session";

export const StartAssessmentButton = () => {
  const { clearSession } = useAssessmentSession();

  return (
    <Button asChild size="lg" className="rounded-2xl">
      <Link href="/assessment" onClick={clearSession}>
        Start Assessment
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
};

