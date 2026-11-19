import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AdapterInfoCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-5 lg:p-7.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 lg:mb-5">
          <div className="flex items-center">
            <Skeleton className="h-11 w-11 rounded-md" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full max-" />
          <Skeleton className="h-3 w-3/4 max-" />
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="w-full flex justify-between items-center py-3.5">
        <Button variant="outline" disabled>
          <Skeleton className="h-4 w-16" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export { AdapterInfoCardSkeleton };
