"use client";

import { AssessmentSessionProvider } from "@/components/shared/assessment-session";
import type { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => (
  <AssessmentSessionProvider>{children}</AssessmentSessionProvider>
);

