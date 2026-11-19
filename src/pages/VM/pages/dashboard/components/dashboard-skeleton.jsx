import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet';

const DashboardSkeleton = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="p-4">
            <Helmet>
                <title>UniRisk | Dashboard</title>
            </Helmet>

            <div className='flex items-center justify-between mb-8'>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-48 rounded-xl" />
                </div>
                <div className='flex items-center gap-4'>
                    <Skeleton className="h-10 w-40 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
            </div>

            <div className="mt-6">
                <Skeleton className="w-full h-[90px] rounded-xl" />
            </div>

            <div className="mt-6">
                <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>

            <div className='grid grid-cols-3 gap-6 mt-6'>
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <Skeleton className="h-[250px] w-full rounded-xl" />
            </div>
        </div>
    );
};

export default DashboardSkeleton;
