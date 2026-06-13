import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export const PageShell = ({ children, className }: PageShellProps) => (
  <main className={cn("mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8", className)}>
    {children}
  </main>
);
