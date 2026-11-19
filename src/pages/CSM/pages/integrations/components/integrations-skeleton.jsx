import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const IntegrationsSkeleton = () => {
  return (
    <div className="p-4">
      {/* Title Skeleton */}
      <div className="flex flex-col gap-2 mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-5 border-b border-border mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filter Toolbar Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-[200px]" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-[280px]">
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="mt-auto pt-2 flex justify-end gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSkeleton;
