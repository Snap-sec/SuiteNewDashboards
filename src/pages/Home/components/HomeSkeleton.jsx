import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import appConfig from "@/config/appConfig.js";

export function HomeSkeleton() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start overflow-auto p-4 bg-background">
      {/* Header section skeleton */}
      <div className="flex flex-col items-center gap-6 mb-12 mx-auto text-center lg:mt-16 max-w-2xl">
        <div className="space-y-2">
          <Skeleton className="h-10 w-72 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
      </div>

      {/* Cards container matching AppCards layout (4 products per row on lg screens) */}
      <div className="space-y-4 w-full max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
          Product Workspace
        </p>

        {/* Product cards list matching flex-wrap & responsive 4 per row */}
        <div className="flex flex-wrap justify-center gap-5 mb-5">
          {appConfig.PRODUCT_LIST.map((_, index) => (
            <div
              key={index}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
            >
              <Card className="h-full">
                <CardContent className="flex flex-col justify-between p-2.5 gap-4">
                  <div className="mb-2.5">
                    <Card className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] mb-4 shadow-none">
                      <Skeleton className="h-10 w-24 rounded-md" />
                    </Card>
                    <Skeleton className="h-5 w-28 mx-auto mb-2" />
                    <Skeleton className="h-4 w-44 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Infrastructure & Settings section */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
            Infrastructure & Settings
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
                <div className="text-start">
                  <Skeleton className="h-3.5 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer logout button skeleton */}
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

