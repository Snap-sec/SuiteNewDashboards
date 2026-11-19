import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const DonutChartSkeleton = ({
  height = 300,
  showLegend = true,
  noCard = false,
  className = '',
}) => {
  const donutSize = height * 0.75;
  const holeSize = donutSize * 0.45;

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 w-full',
        className,
      )}
      style={{ height }}
    >
      {/* Donut */}
      <div className="relative flex items-center justify-center">
        <Skeleton
          className="rounded-full"
          style={{
            width: donutSize,
            height: donutSize,
          }}
        />

        {/* Center hole */}
        <div
          className="absolute rounded-full bg-background"
          style={{
            width: holeSize,
            height: holeSize,
          }}
        />

        {/* Center text skeleton */}
        <div className="absolute flex flex-col items-center gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="w-full max-w-xs space-y-2 pt-2">
          {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-xs" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (noCard) {
    return <div className="w-full">{content}</div>;
  }

  return content;
};

export default DonutChartSkeleton;
