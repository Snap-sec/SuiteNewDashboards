import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


function AgentSettingsSkeleton() {
    return (
        <div className="mt-6 space-y-8">
            {/* Installation Card Skeleton */}
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-80 mt-2" />
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    {/* OS Selection Skeleton */}
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                    </div>

                    {/* Prerequisites Alert Skeleton */}
                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-5 w-28" />
                        </div>
                        <div className="space-y-2 ml-7">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-56" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                    </div>

                    {/* Installation Command Skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </div>

                    {/* Post-Installation Skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                </CardContent>
            </Card>

            {/* Configuration Card Skeleton */}
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-72 mt-2" />
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <div className="flex gap-0">
                            <Skeleton className="h-10 flex-1 rounded-r-none" />
                            <Skeleton className="h-10 w-10 rounded-none" />
                            <Skeleton className="h-10 w-10 rounded-l-none" />
                        </div>
                        <Skeleton className="h-3 w-64" />
                    </div>

                    <div className="p-4 rounded-lg border">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-44" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Agent Management Card Skeleton */}
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-4 w-80 mt-2" />
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-14 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t">
                        <div className="flex items-center gap-2 mb-4">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-14 w-full rounded-lg" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AgentSettingsSkeleton;