interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
}

export function FormNavigation({
  onBack,
  onNext,
  backLabel = "← Volver",
  nextLabel = "Continuar",
  showBack = true,
  showNext = true,
}: FormNavigationProps) {
  return (
    <div className="flex gap-3 pt-2">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 flex-1 rounded-lg border border-slate-300 px-6 text-base font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:flex-none sm:px-8"
        >
          {backLabel}
        </button>
      )}
      {showNext && (
        <button
          type="button"
          onClick={onNext}
          className="min-h-12 flex-1 rounded-lg bg-brand-600 px-6 text-base font-semibold text-white transition-colors hover:bg-brand-700 sm:flex-none sm:px-8"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
