interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const percent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="hidden gap-4 overflow-x-auto text-xs font-medium text-slate-500 sm:flex">
        {steps.map((step, i) => (
          <span
            key={step}
            className={`shrink-0 whitespace-nowrap ${
              i === currentStep ? "text-brand-700" : i < currentStep ? "text-brand-500" : "text-slate-400"
            }`}
          >
            {step.toUpperCase()}
          </span>
        ))}
      </div>
      <p className="text-xs font-medium text-slate-500 sm:hidden">
        Paso {currentStep + 1} de {steps.length}: <span className="text-brand-700">{steps[currentStep]}</span>
      </p>
    </div>
  );
}
