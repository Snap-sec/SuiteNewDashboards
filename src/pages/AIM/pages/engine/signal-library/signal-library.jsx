import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { SearchInput } from '@/components/custom/search';
import { RefreshCw } from 'lucide-react';
import PageHeading from '@/components/custom/page-heading';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TemplateCard from './components/template-card';
import { useGetAimPolicyLibraryQuery, useRefreshAimPolicyLibraryMutation } from '@/services/asset-inventory/policyApi';
import useDebounce from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';

export default function SignalLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data: libraryData, isLoading, isFetching } = useGetAimPolicyLibraryQuery({ search: debouncedSearch });
  const [refreshLibrary, { isLoading: isRefreshing }] = useRefreshAimPolicyLibraryMutation();

  const handleRefresh = () => {
    toast.promise(refreshLibrary().unwrap(), {
      loading: 'Refreshing rule library from repository...',
      success: 'Rule library refreshed successfully',
      error: (err) => err?.data?.message || 'Failed to refresh rule library'
    });
  };

  const rawTemplates = libraryData?.data?.rules || libraryData?.data || libraryData?.results || libraryData || [];
  const templates = Array.isArray(rawTemplates) ? rawTemplates : [];

  return (
    <>
      <Helmet>
        <title>AssetIQ | Rule Template Library</title>
      </Helmet>
      <div className="p-4 lg:p-6 flex flex-col gap-8">
        <div className="flex items-center justify-between gap-6">
          <PageHeading
            title="Rule template library"
            description="Browse prebuilt signal and automation rules."
          />
          <div className="flex items-center gap-3 w-full max-w-md">
            <SearchInput
              placeholder="Search rule templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {isLoading || isFetching ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))
          ) : templates.length > 0 ? (
            templates.map((rule) => (
              <TemplateCard key={rule._id || rule.id} template={rule} />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyScreen
                title="No templates found"
                subTitle="There's currently no data available. Please Refresh to get started."
                engage={
                  <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
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
