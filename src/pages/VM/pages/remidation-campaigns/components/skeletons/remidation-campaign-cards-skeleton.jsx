import { Skeleton } from '@/components/ui/skeleton';

function RemidationCampaignsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((idx) => (
        <div
          key={idx}
          className="flex items-center gap-5 px-5 py-4 bg-card border border-border rounded-xl"
        >
          {/* Icon skeleton */}
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />

          {/* Title + description skeleton */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Severity badges skeleton */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-5 w-8 rounded" />
            ))}
          </div>

          {/* Stats skeleton */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-14 w-14 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default RemidationCampaignsSkeleton;
