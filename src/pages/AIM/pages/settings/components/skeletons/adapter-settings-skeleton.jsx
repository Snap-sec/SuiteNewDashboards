import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsAdapterSkeletonLoader() {
  return (
    <div className="py-4 mx-auto">
      <Card>
        {/* Header */}
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            Global Sync Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure default sync settings that apply to all adapters
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Auto Sync Toggle */}
          <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>

          {/* Sync Schedule */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-3 w-56" />
          </div>

          {/* Time Picker */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-3 w-40" />
          </div>

          {/* Batch Size */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-3 w-72" />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Skeleton className="h-11 w-64 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
