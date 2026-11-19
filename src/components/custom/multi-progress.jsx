import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

function MultiProgress({
  className,
  safeValue = 0,
  exposedValue = 0,
  safeIndicatorClassName,
  exposedIndicatorClassName,
  ...props
}) {
  // Ensure values stay between 0–100
  const safe = Math.min(Math.max(safeValue, 0), 100);
  const exposed = Math.min(Math.max(exposedValue, 0), 100);

  // Calculate effective exposed width so it doesn’t exceed total 100%
  const effectiveExposedWidth = Math.max(0, Math.min(100 - safe, exposed));

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
        className,
      )}
      {...props}
    >
      {/* Safe Indicator */}
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator-safe"
        className={cn(
          'absolute left-0 top-0 h-full bg-[#1B9609] transition-all',
          safeIndicatorClassName,
        )}
        style={{ width: `${safe}%` }}
      />

      {/* Exposed Indicator — starts where safe ends */}
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator-exposed"
        className={cn(
          'absolute top-0 h-full bg-[#ff0000] transition-all opacity-80',
          exposedIndicatorClassName,
        )}
        style={{
          left: `${safe}%`,
          width: `${effectiveExposedWidth}%`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { MultiProgress };
