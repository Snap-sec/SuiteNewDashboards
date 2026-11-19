import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonLoader = () => {
  return (
    <div className="w-full h-[calc(100vh-100px)]">
      <ScrollArea className="h-full overflow-y-auto p-2 flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[100px] md:h-[100px] lg:h-[300px] w-full" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <Skeleton className="h-[100px] md:h-[200px] lg:h-[300px] w-full" />
            </div>
            <div className="md:col-span-4">
              <Skeleton className="h-[100px] md:h-[200px] lg:h-[300px] w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 flex flex-col gap-4">
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
            </div>
            <div className="md:col-span-8">
              <Skeleton className="h-[350px] w-full" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SkeletonLoader;
