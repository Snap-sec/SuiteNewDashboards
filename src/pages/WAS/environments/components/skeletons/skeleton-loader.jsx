import { Skeleton } from '@/components/ui/skeleton';

function EnvironmentTableSkeleton({ rows = 10 }) {
  return (
    <div className="rounded-md border">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_3fr] gap-4 p-4 border-b bg-muted/30">
        <Skeleton className="h-4 w-20" /> {/* Key */}
        <Skeleton className="h-4 w-14" /> {/* Type */}
        <Skeleton className="h-4 w-20" /> {/* Value */}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[2fr_1fr_3fr] gap-4 p-4 border-b last:border-b-0"
        >
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export default EnvironmentTableSkeleton;
