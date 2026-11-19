import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const AreaChartSkeleton = ({
  height = 300,
  className = '',
}) => {
  const chartHeight = height - 40; // leave room for x labels

  return (
    <div
      className={cn(
        'w-full flex flex-col justify-between relative border border-dashed border-border p-4 rounded-xl',
        className,
      )}
      style={{ height }}
    >
      {/* Grid lines background */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pb-10 pointer-events-none">
        <div className="border-b border-border/40 w-full" />
        <div className="border-b border-border/40 w-full" />
        <div className="border-b border-border/40 w-full" />
        <div className="border-b border-border/40 w-full" />
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 w-full relative animate-pulse" style={{ height: chartHeight }}>
        {/* SVG Area Chart Mock */}
        <div className="absolute inset-0 pb-6 text-accent/30">
          <svg
            className="w-full h-full text-current"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.4} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            {/* Shaded Area */}
            <path
              d="M0 90 C15 60, 30 20, 45 50 C60 80, 75 40, 90 60 L100 40 L100 100 L0 100 Z"
              fill="url(#areaGrad)"
            />
            {/* Stroke Line */}
            <path
              d="M0 90 C15 60, 30 20, 45 50 C60 80, 75 40, 90 60 L100 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* X Labels */}
      <div className="flex justify-between items-center px-2 z-10">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
};

export default AreaChartSkeleton;
