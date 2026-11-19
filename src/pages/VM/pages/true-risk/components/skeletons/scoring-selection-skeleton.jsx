// components/scoring-selection-skeleton.jsx

import { Skeleton } from '@/components/ui/skeleton';

const ScoringSelectionSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((item) => (
          <div key={item} className="rounded-lg border p-4 space-y-4 bg-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>

              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="border rounded-lg bg-card overflow-hidden shadow-sm">
        {/* Header */}
        <div className="border-b px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-56" />
          </div>

          <Skeleton className="h-5 w-28 rounded-full" />
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="space-y-4 pt-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-10" />
                    </div>

                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />

                <div className="rounded-md border p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-52" />

            <div className="border rounded-md overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-4 w-12 ml-auto" />
              </div>

              {/* Rows */}
              {[1, 2, 3, 4].map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-4 gap-4 px-4 py-4 border-b last:border-0 items-center"
                >
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-10 mx-auto" />
                  <Skeleton className="h-4 w-10 mx-auto" />
                  <Skeleton className="h-6 w-16 ml-auto rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringSelectionSkeleton;
