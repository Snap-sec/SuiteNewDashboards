import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const RePieChartSkeleton = ({ height = 300, showLegend = true, className }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 w-full',
        className,
      )}
      style={{ height }}
    >
      {/* Pie placeholder */}
      <Skeleton
        className="rounded-full"
        style={{
          width: height * 0.7,
          height: height * 0.7,
        }}
      />

      {/* Legend placeholder */}
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
};

export default RePieChartSkeleton;
