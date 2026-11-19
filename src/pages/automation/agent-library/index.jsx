import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { useGetAutomationAgentLibraryQuery } from '@/services/automation/agentsApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '@/components/custom/search';
import ApiErrorHandler from '../../../components/common/api-error-handler';
import AgentCard from './components/agent-card';

export default function AgentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data: libraryData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAutomationAgentLibraryQuery({ search: debouncedSearch });

  const isRefreshing = isFetching;

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  const handleRefresh = async () => {
    try {
      await refetch().unwrap();
      toast.success('Agent library refreshed successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to refresh agent library');
    }
  };

  const rawAgents =
    libraryData?.data?.data ||
    libraryData?.data?.agents ||
    libraryData?.data ||
    libraryData?.results ||
    libraryData ||
    [];
  const agents = Array.isArray(rawAgents) ? rawAgents : [];

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <>
      <Helmet>
        <title>Automation | Agent Library</title>
      </Helmet>
      <div className="p-4 lg:p-6 flex flex-col gap-8">
        <div className="flex items-center justify-between gap-6">
          <PageHeading
            title="Agent Library"
            description="Browse and import prebuilt agents."
          />
          <div className="flex items-center gap-3 w-full max-w-md">
            <SearchInput
              placeholder="Search agent templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {isLoading || isFetching ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col p-5">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="size-9 rounded-md" />
                </div>
                <div className="mb-2 min-h-[48px] flex flex-col justify-center gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <div className="mb-6 min-h-[60px] flex flex-col gap-2 mt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>
              </Card>
            ))
          ) : agents.length > 0 ? (
            agents.map((agent) => (
              <AgentCard key={agent._id || agent.id} agent={agent} />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyScreen
                title="No agents found"
                subTitle="There's currently no data available. Please Refresh to get started."
                engage={
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                    Refresh
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
