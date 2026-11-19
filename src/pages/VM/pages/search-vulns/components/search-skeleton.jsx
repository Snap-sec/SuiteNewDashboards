import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const SearchSkeleton = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="min-h-screen">
            <main className="px-6 py-6">
                <div className="max-w-full mx-auto">
                    {/* Search Box Skeleton */}
                    <Card className="border-1 bg-accent mb-6">
                        <CardContent className="p-2">
                            <div className="flex items-center gap-2 px-3 py-2">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Skeletons */}
                    <div className="flex flex-col gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="border-1">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-3">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SearchSkeleton;
