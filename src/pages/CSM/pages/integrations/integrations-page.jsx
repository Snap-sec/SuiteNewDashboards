import { useMemo, useState } from 'react';
import { Error403 } from '@/pages/error/403-error';
import { Error404 } from '@/pages/error/404-error';
import { Blocks, PlugZap, Terminal } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import {
  useGetCsmAdapterListQuery,
  useGetInstalledCsmAdaptersQuery,
} from '@/services/csm/adaptersApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '@/components/custom/search';
import Select from '@/components/custom/select';
import { IntegrationCard } from './components/integration-card';
import ModalRegistry from './components/modal-registry';
import RefreshLogs from './components/refresh-logs';
import { IntegrationProvider } from './context/integration-context';
import { useStore } from './store';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function IntegrationsPage() {
  const {
    data: rawData,
    isLoading: adaptersLoading,
    error,
    isError,
  } = useGetCsmAdapterListQuery();
  const data = rawData?.data;

  const {
    data: installedData,
    isLoading: installedLoading,
    isError: isInstalledError,
    error: installedError,
  } = useGetInstalledCsmAdaptersQuery();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'all-integrations';

  const handleTabChange = (value) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('tab', value);
      return nextParams;
    });
    setSearchQuery('');
  };

  const { setSelectedTab } = useStore();

  const categories = ['All', ...(data?.categories || [])];

  // Filter by search query (name, description, or category)
  const filterBySearch = (adapters) => {
    if (!searchQuery.trim()) return adapters;
    const query = searchQuery.toLowerCase().trim();
    return adapters?.filter(
      (adapter) =>
        adapter.title?.toLowerCase().includes(query) ||
        adapter.description?.toLowerCase().includes(query) ||
        adapter.category?.some((cat) => cat.toLowerCase().includes(query)),
    );
  };

  const filteredAdapters = filterBySearch(
    selectedCategory === 'All'
      ? data?.adapters
      : data?.adapters?.filter((adapter) =>
          adapter.category?.includes(selectedCategory),
        ),
  );

  const activeAdapters = useMemo(() => {
    if (!installedData || !data?.adapters) return [];

    const installedArray = Array.isArray(installedData)
      ? installedData
      : Array.isArray(installedData?.data)
        ? installedData.data
        : Array.isArray(installedData?.integrations)
          ? installedData.integrations
          : Array.isArray(installedData?.data?.integrations)
            ? installedData.data.integrations
            : Array.isArray(installedData?.adapters)
              ? installedData.adapters
              : Array.isArray(installedData?.data?.adapters)
                ? installedData.data.adapters
                : [];

    const installedList = installedArray
      .map((installed) => {
        const definition = data.adapters.find(
          (d) => d.type?.toLowerCase() === installed.adapterName?.toLowerCase(),
        );
        if (!definition) return null;

        return {
          ...definition,
          ...installed,
          instance_id: installed._id,
          is_installed: true,
        };
      })
      .filter(Boolean);

    return filterBySearch([...installedList]);
  }, [installedData, data, searchQuery]);

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  // Handle 404 and 403 errors
  if (error) {
    if (error.status === 404) {
      return <Error404 />;
    }
    if (error.status === 403) {
      return <Error403 />;
    }
  }

  return (
    <IntegrationProvider>
      <div className="p-4">
        <Helmet>
          <title>CSM | Integrations</title>
        </Helmet>

        <PageHeading
          title="Integrations"
          description="Connect and configure cloud providers and third-party security tools to collect cloud assets, monitor security posture, and centralize findings across environments."
        />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList variant="line" size="md">
            <div className="w-full flex flex-wrap gap-1 md:gap-5">
              <TabsTrigger value="all-integrations">
                <Blocks /> All Integrations
              </TabsTrigger>
              <TabsTrigger value="active-integrations">
                <PlugZap /> Active Integrations
              </TabsTrigger>
              <TabsTrigger value="logs">
                <Terminal /> Logs
              </TabsTrigger>
            </div>

            {activeTab !== 'logs' && (
              <div className="w-full flex justify-end">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search integrations..."
                />
              </div>
            )}
          </TabsList>

          <TabsContent value="all-integrations">
            <div className="flex justify-between items-center mt-2.5">
              <div className="text-xs text-muted-foreground">
                Showing{' '}
                {adaptersLoading ? '...' : filteredAdapters?.length || 0}{' '}
                integrations
              </div>
              <div className="w-[200px]">
                {!adaptersLoading && (
                  <Select
                    value={selectedCategory}
                    onChange={(option) =>
                      setSelectedCategory(option?.value || 'All')
                    }
                    options={categoryOptions}
                    placeholder="Filter by Category"
                    enableSearch={true}
                  />
                )}
              </div>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adaptersLoading ? (
                [...Array(6)].map((_, i) => (
                  <IntegrationCard key={i} isLoading={true} />
                ))
              ) : isError ? (
                <div className="col-span-full">
                  <ApiErrorHandler error={error} />
                </div>
              ) : filteredAdapters?.length > 0 ? (
                filteredAdapters.map((adapter) => (
                  <IntegrationCard
                    key={adapter.title}
                    adapter={adapter}
                    view="all"
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyScreen
                    title="No integrations found"
                    subTitle={
                      searchQuery
                        ? `We couldn't find any integrations matching "${searchQuery}". Try a different search term or category.`
                        : 'There are currently no integrations available.'
                    }
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active-integrations">
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {installedLoading || adaptersLoading ? (
                [...Array(3)].map((_, i) => (
                  <IntegrationCard key={i} isLoading={true} />
                ))
              ) : isInstalledError ? (
                <div className="col-span-full">
                  <ApiErrorHandler error={installedError} />
                </div>
              ) : (
                <>
                  {activeAdapters?.map((adapter) => (
                    <IntegrationCard
                      key={adapter.instance_id}
                      adapter={adapter}
                      view="active"
                    />
                  ))}
                  {activeAdapters?.length === 0 && (
                    <div className="col-span-full">
                      <EmptyScreen
                        title="No active integrations found"
                        subTitle="You haven't installed any integrations yet."
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <RefreshLogs />
          </TabsContent>
        </Tabs>

        <ModalRegistry />
      </div>
    </IntegrationProvider>
  );
}

export default IntegrationsPage;
