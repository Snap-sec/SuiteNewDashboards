import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DetailsSkeleton() {
  return (
    <main className="flex-1 bg-background overflow-hidden">
      <div className="p-6">
        <header className="mb-4">
          <div className="flex items-start justify-between w-full">
            <div className="pl-3 space-y-2">
              <Skeleton className="h-6 w-64" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-32" />
              </div>
            </div>
          </div>
        </header>
        <div className="space-y-4">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-border/40 min-h-[50px]">
                <Skeleton className="h-6 w-14 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
