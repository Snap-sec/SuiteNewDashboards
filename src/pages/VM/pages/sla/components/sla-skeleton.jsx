import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const SLASkeleton = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-96" />
                    <Skeleton className="h-4 w-64 mt-1" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Metrics Card Skeleton */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Charts Grid Skeleton */}
            <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="h-[400px]">
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-32 mb-6" />
                            <div className="flex items-center justify-center h-[300px]">
                                <Skeleton className="h-[250px] rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table Skeleton */}
            <Card>
                <CardContent className="p-6">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SLASkeleton;
