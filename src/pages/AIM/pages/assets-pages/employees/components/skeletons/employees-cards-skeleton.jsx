import { Fragment } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function EmployeeInfoCardSkeleton() {
  return (
    <Card className="flex flex-col items-center p-5 lg:py-10 relative">
      {/* Badge */}
      <div className="absolute top-2 right-2">
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Avatar */}
      <div className="mb-3.5">
        <Skeleton className="h-[60px] rounded-full" />
      </div>

      {/* Name + verify */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>

      {/* Email */}
      <Skeleton className="h-3 w-36 mb-3" />

      {/* Last login */}
      <div className="flex gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </Card>
  );
}

export function EmployeesCardsSkeleton({ count = 8 }) {
  return (
    <Fragment>
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-7.5">
        {Array.from({ length: count }).map((_, index) => (
          <EmployeeInfoCardSkeleton key={index} />
        ))}
      </div>

      {/* Load more */}
      <div className="flex grow justify-center pt-5 lg:pt-7.5">
        <Skeleton className="h-4 w-32" />
      </div>
    </Fragment>
  );
}
