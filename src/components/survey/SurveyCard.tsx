import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SurveyCardProps {
  children: ReactNode;
  className?: string;
}

export function SurveyCard({ children, className }: SurveyCardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-lg overflow-hidden", className)}>
      {children}
    </div>
  );
}
