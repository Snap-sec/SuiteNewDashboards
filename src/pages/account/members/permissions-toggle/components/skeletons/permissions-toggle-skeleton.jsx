import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PermissionsToggleSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* User Card Skeleton */}
      <Card className="w-full p-4">
        <div className="flex flex-col items-center gap-4 relative">
          {/* Top-right action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Skeleton className="h-9 w-40 rounded-md" /> {/* Reset Password */}
            <Skeleton className="h-9 w-24 rounded-md" /> {/* Delete */}
          </div>

          {/* Avatar */}
          <Skeleton className="size-[100px] rounded-full mt-6" />

          {/* Name & Email */}
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>

          {/* Meta info */}
          <div className="flex gap-6 mt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Role */}
          <div className="w-full mt-4">
            <Skeleton className="h-3 w-12 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Team */}
          <div className="w-full mt-3">
            <Skeleton className="h-3 w-12 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Assessments */}
          <div className="w-full mt-3">
            <Skeleton className="h-3 w-20 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </Card>

      {/* Product Access Skeleton */}
      <Card className="w-full p-4">
        <Skeleton className="h-4 w-32 mb-4" />

        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-[45px] rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>

              {/* Switch */}
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsToggleSkeleton;
