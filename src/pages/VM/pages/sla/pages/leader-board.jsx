
import { useEffect } from 'react';
import LeaderbardTable from "../components/leaderboard-table";
import { useGetVmSLALoaderboardQuery } from "../../../../../services/vm/slaApi";
import { ContentLoader } from "@/components/common/content-loader";
import useDebounce from '../../../../../hooks/use-debounce';
import useStore from '../store';
import PageHeading from "@/components/custom/page-heading";
import { Helmet } from 'react-helmet';


import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function LeaderBoard() {
    const sorting = useStore((state) => state.sorting);
    const filters = useStore((state) => state.filters);
    const searchQuery = useStore((state) => state.searchQuery);

    const debouncedSearch = useDebounce(searchQuery, 400);

    const { data: leaderbaordData, refetch, isLoading, isFetching, isError, error } = useGetVmSLALoaderboardQuery({
        search: debouncedSearch,
        ...filters,
        ...(sorting?.length && sorting[0]
            ? {
                sortBy: sorting[0]?.id,
                sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
            }
            : {}),
    });

    const hasData = leaderbaordData?.data?.leaderboard?.length > 0 || leaderbaordData?.data?.total > 0;
    const hasActiveFilters = (filters && Object.keys(filters).length > 0) || Boolean(searchQuery);

    if(isError) return <ApiErrorHandler error={error} />
    
    return (
        <div>
            <Helmet>
                <title>UniRisk | SLA Leaderboard</title>
            </Helmet>
            {(!isLoading && !hasData && !hasActiveFilters) ? null : (
                <PageHeading
                    title="SLA Leaderboard"
                    description="View the SLA leaderboard for your organization."
                />
            )}
            
            {!isLoading && !hasData && !hasActiveFilters ? (
                <EmptyScreen
                    title="Leaderboard Empty"
                    subTitle="Rankings will automatically populate as SLA activity is recorded across your organization."
                />
            ) : (
                <LeaderbardTable data={leaderbaordData?.data} isLoading={isLoading || isFetching} />
            )}
        </div>
    )
}

export default LeaderBoard;