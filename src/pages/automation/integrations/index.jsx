import { useState } from 'react';
import { Blocks, PlugZap, Terminal } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import {
  useGetAutomationAdapterListQuery,
} from '@/services/automation/adaptersApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import Select from '@/components/custom/select';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '@/components/custom/search';
import { IntegrationCard } from './components/integration-card';
import InstalledModelsTab from './components/tabs/installed-models-tab';
import ModalRegistry from './components/modal-registry';
import RefreshLogs from './components/refresh-logs';
import { IntegrationProvider } from './context/integration-context';
import { useStore } from './store';

function AutomationIntegrations() {
  const {
    data,
    isLoading: adaptersLoading,
    error,
    isError,
  } = useGetAutomationAdapterListQuery();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab =
    rawTab === 'active-integrations'
      ? 'active-models'
      : rawTab === 'all-integrations'
        ? 'all-models'
        : rawTab || 'all-models';

  const handleTabChange = (value) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('tab', value);
      return nextParams;
    });
    setSearchQuery('');
  };

  const adapterPayload = data?.data?.data || data?.data || data || {};
  const categories = ['All', ...(adapterPayload?.categories || [])];

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
      ? adapterPayload?.adapters
      : adapterPayload?.adapters?.filter((adapter) =>
        adapter.category?.includes(selectedCategory),
      ),
  );

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  return (
    <IntegrationProvider>
      <div className="p-4">
        <Helmet>
          <title>Automation | Models</title>
        </Helmet>

        <PageHeading
          title="Models"
          description="Connect and configure third-party AI models and providers."
        />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList variant="line" size="md">
            <div className="w-full flex flex-wrap gap-1 md:gap-5">
              <TabsTrigger value="all-models">
                <Blocks /> All Models
              </TabsTrigger>
              <TabsTrigger value="active-models">
                <PlugZap /> Active Models
              </TabsTrigger>
              <TabsTrigger value="logs">
                <Terminal /> Logs
              </TabsTrigger>
            </div>

            {/* search will appear here  */}
            {activeTab != 'logs' && (
              <div className="w-full flex justify-end">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search models..."
                />
              </div>
            )}
          </TabsList>

          <TabsContent value="all-models">
            <div className="flex justify-between items-center mt-2.5">
              <div className="text-xs text-muted-foreground">
                Showing{' '}
                {adaptersLoading ? '...' : filteredAdapters?.length || 0}{' '}
                models
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
              {!isError && adaptersLoading ? (
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
                  <NoSearchResultsFound
                    title="No models found"
                    subTitle={
                      searchQuery
                        ? `We couldn't find any models matching "${searchQuery}". Try a different search term or category.`
                        : 'There are currently no models available.'
                    }
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active-models">
            <InstalledModelsTab
              adapterPayload={adapterPayload}
              adaptersLoading={adaptersLoading}
            />
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

export default AutomationIntegrations;
