// components/risk-scoring-skeleton.jsx

import { Skeleton } from '@/components/ui/skeleton';

const MetricSectionSkeleton = ({ withLevels = false }) => {
  return (
    <div className="border rounded-xl bg-card">
      {/* Accordion Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-5 w-5 rounded-md" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-sm" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Accordion Content */}
      <div className="p-5 space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Weight Controls */}
        <div className="grid gap-4 max-w-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-3 w-3" />
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-3 py-2">
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>

        {/* Risk Levels */}
        {withLevels && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <Skeleton className="h-3 w-48" />

            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-8 py-3 px-2"
                >
                  {/* Label */}
                  <div className="flex-1 min-w-[140px]">
                    <Skeleton className="h-4 w-32" />
                  </div>

                  {/* Slider */}
                  <div className="flex-[3]">
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>

                  {/* Input */}
                  <div className="min-w-[60px] flex justify-end">
                    <Skeleton className="h-8 w-14 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RiskScoringSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Total Weight Card */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-44" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-40 rounded-md" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-2 w-full rounded-full" />

          <div className="flex justify-between">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        <MetricSectionSkeleton />
        <MetricSectionSkeleton withLevels />
        <MetricSectionSkeleton withLevels />
        <MetricSectionSkeleton />
        <MetricSectionSkeleton />
        <MetricSectionSkeleton withLevels />
        <MetricSectionSkeleton withLevels />
      </div>
    </div>
  );
};

export default RiskScoringSkeleton;
