import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const BAR_HEIGHTS = [90, 140, 110, 170, 120, 150];

const BarChartSkeleton = ({
  height = 300,
  bars = 5,
  showYAxis = false,
  yAxisWidth = 40,
  className = '',
}) => {
  const chartHeight = height - 40; // leave room for x labels

  return (
    <div
      className={cn(
        'w-full flex items-end gap-4 px-4 border border-dashed border-border',
        className,
      )}
      style={{ height }}
    >
      {/* Y AXIS */}
      {showYAxis && (
        <div
          className="flex flex-col justify-between pb-6"
          style={{ width: yAxisWidth, height: chartHeight }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      )}

      {/* BARS */}
      <div
        className="flex-1 flex items-end justify-between gap-4"
        style={{ height: chartHeight }}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const barHeight = BAR_HEIGHTS[i % BAR_HEIGHTS.length];

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end gap-2"
            >
              {/* BAR */}
              <Skeleton
                className="w-full rounded-md"
                style={{ height: barHeight }}
              />

              {/* X LABEL */}
              <Skeleton className="h-3 w-6" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChartSkeleton;
