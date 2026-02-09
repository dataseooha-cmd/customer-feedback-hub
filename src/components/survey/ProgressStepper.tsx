interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressStepper({ currentStep, totalSteps }: ProgressStepperProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full survey-progress-bar rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-foreground font-medium">
          <strong>Langkah {currentStep}</strong> dari {totalSteps}
        </span>
      </div>
    </div>
  );
}
