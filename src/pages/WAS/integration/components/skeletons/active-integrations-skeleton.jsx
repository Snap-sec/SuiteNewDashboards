import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ActiveIntegrationSkeleton({ count = 6 }) {
  return (
    <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-none">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx}>
          {/* ===== CARD CONTENT ===== */}
          <CardContent className="p-5 lg:p-7.5">
            {/* Logo + Badge */}
            <div className="flex items-center justify-between mb-3 lg:mb-5">
              <Skeleton className="h-11 w-24 rounded-md" />
            </div>

            {/* Title + Description */}
            <div className="flex flex-col gap-1 lg:gap-2.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>

          {/* ===== FOOTER ===== */}
          <CardFooter className="w-full flex justify-between items-center py-3.5">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
