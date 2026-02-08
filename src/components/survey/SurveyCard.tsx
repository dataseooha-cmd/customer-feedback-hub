import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SurveyCardProps {
  children: ReactNode;
  className?: string;
}

export function SurveyCard({ children, className }: SurveyCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 md:p-8 shadow-survey animate-slide-up",
        className
      )}
    >
      {children}
    </div>
  );
}
