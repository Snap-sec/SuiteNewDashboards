import React, { useState } from 'react';
import { FolderInput, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import {
  useGetAsmRuleLibraryQuery,
  useRefreshAsmRuleLibraryMutation,
  useImportAllAsmRulesFromLibraryMutation,
} from '@/services/asm/ruleApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '@/components/custom/search';
import { EmptyScreen } from '../../../components/common/empty-screen';
import TemplateCard from './components/template-card';

export default function SignalLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data: libraryData,
    isLoading,
    isFetching,
  } = useGetAsmRuleLibraryQuery({ search: debouncedSearch });
  const [refreshLibrary, { isLoading: isRefreshing }] =
    useRefreshAsmRuleLibraryMutation();
  const [importAllRules, { isLoading: isImportingAll }] =
    useImportAllAsmRulesFromLibraryMutation();

  const handleRefresh = () => {
    toast.promise(refreshLibrary().unwrap(), {
      loading: 'Refreshing rule library from repository...',
      success: 'Rule library refreshed successfully',
      error: (err) => err?.data?.message || 'Failed to refresh rule library',
    });
  };

  const handleImportAll = () => {
    toast.promise(importAllRules({ skipExisting: false }).unwrap(), {
      loading: 'Importing all rule templates...',
      success: 'All rules imported successfully',
      error: (err) => err?.data?.message || 'Failed to import rules',
    });
  };

  const rawTemplates =
    libraryData?.data?.rules ||
    libraryData?.data ||
    libraryData?.results ||
    libraryData ||
    [];
  const templates = Array.isArray(rawTemplates) ? rawTemplates : [];

  return (
    <>
      <Helmet>
        <title>Xpose | Rule Template Library</title>
      </Helmet>
      <div className="p-4 lg:p-6 flex flex-col gap-8">
        <div className="flex items-center justify-between gap-6">
          <PageHeading
            title="Rule template library"
            description="Browse prebuilt signal and automation rules."
          />
          <div className="flex items-center gap-3 w-full max-w-xl justify-end">
            <SearchInput
              placeholder="Search rule templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xs"
            />
            <ButtonWithConfirm
              variant="outline"
              disabled={isImportingAll}
              confirm={true}
              confirmVariant="info"
              confirmTitle="Import All Rules"
              dialog="Are you sure you want to import all rule templates into your organization's active rules?"
              onConfirm={handleImportAll}
              confirmButton={
                <Button variant="primary" disabled={isImportingAll}>
                  {isImportingAll ? 'Importing...' : 'Import'}
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              <FolderInput className="size-4 mr-2" />
              {isImportingAll ? 'Importing...' : 'Import all'}
            </ButtonWithConfirm>
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
                  <Skeleton className="h-6 w-20 rounded-full" />
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
                    <Skeleton className="h-9 w-10 rounded-md" />
                  </div>
                </div>
              </Card>
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
