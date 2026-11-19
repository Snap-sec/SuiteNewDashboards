import { useState } from 'react';
import { Blocks, PlugZap, Terminal, Webhook } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '@/components/custom/search';
import Select from '@/components/custom/select';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { IntegrationCard } from './components/integration-card';
import ModalRegistry from './components/modal-registry';
import { ScaSyncLogsTable } from './components/sca-sync-logs-table';
import { ScaWebhooksPanel } from './components/sca-webhooks-panel';
import {
  IntegrationProvider,
  useIntegration,
} from './context/integration-context';
import { useStore } from './store';

function SCAIntegrationsContent() {
  const {
    adaptersLoading,
    installedLoading,
    error,
    filteredAdapters,
    activeAdapters,
    categoryOptions,
    selectedCategory,
    setSelectedCategory,

    isAllIntegrationsError,
    isActiveIntegrationsError,
    activeIntegrationsError,
    isWebhooksError,
    webhooksError,
    isLogsError,
    logsError,
  } = useIntegration();

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

  // Filter by search query (title, name, description, or category)
  const filterBySearch = (adapters) => {
    if (!searchQuery.trim()) return adapters;
    const query = searchQuery.toLowerCase().trim();
    return adapters?.filter((adapter) => {
      const matchTitle =
        adapter.title?.toLowerCase().includes(query) ||
        adapter.name?.toLowerCase().includes(query);
      const matchDesc = adapter.description?.toLowerCase().includes(query);
      const matchCat = Array.isArray(adapter.category)
        ? adapter.category.some((cat) => cat.toLowerCase().includes(query))
        : adapter.category?.toLowerCase().includes(query);
      return matchTitle || matchDesc || matchCat;
    });
  };

  const searchedFilteredAdapters = filterBySearch(filteredAdapters);
  const searchedActiveAdapters = filterBySearch(activeAdapters);

  return (
    <div className="p-4">
      <Helmet>
        <title>SCA | Integrations</title>
      </Helmet>

      <PageHeading
        title="Integrations"
        description="Connect third-party security tools and data sources to automate repository scanning, synchronize security findings, and streamline vulnerability management workflows."
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
            <TabsTrigger value="webhooks">
              <Webhook /> Webhooks
            </TabsTrigger>
          </div>

          {/* search will appear here */}
          {activeTab !== 'logs' && activeTab !== 'webhooks' && (
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
              {adaptersLoading ? '...' : searchedFilteredAdapters?.length || 0}{' '}
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
            {!isAllIntegrationsError && adaptersLoading ? (
              [...Array(6)].map((_, i) => (
                <IntegrationCard key={i} isLoading={true} />
              ))
            ) : isAllIntegrationsError ? (
              <div className="col-span-full">
                <ApiErrorHandler error={error} />
              </div>
            ) : searchedFilteredAdapters?.length > 0 ? (
              searchedFilteredAdapters.map((adapter) => (
                <IntegrationCard
                  key={adapter.id || adapter.title}
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
            {(!isActiveIntegrationsError && installedLoading) ||
            adaptersLoading ? (
              [...Array(3)].map((_, i) => (
                <IntegrationCard key={i} isLoading={true} />
              ))
            ) : isActiveIntegrationsError ? (
              <div className="col-span-full">
                <ApiErrorHandler error={activeIntegrationsError} />
              </div>
            ) : (
              <>
                {searchedActiveAdapters?.map((adapter) => (
                  <IntegrationCard
                    key={adapter.id || adapter.instance_id || adapter.title}
                    adapter={adapter}
                    view="active"
                  />
                ))}
                {searchedActiveAdapters?.length === 0 && (
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
          {isLogsError ? (
            <div className="col-span-full">
              <ApiErrorHandler error={logsError} />
            </div>
          ) : (
            <ScaSyncLogsTable />
          )}
        </TabsContent>

        <TabsContent value="webhooks">
          {isWebhooksError ? (
            <div className="col-span-full">
              <ApiErrorHandler error={webhooksError} />
            </div>
          ) : (
            <ScaWebhooksPanel />
          )}
        </TabsContent>
      </Tabs>

      <ModalRegistry />
    </div>
  );
}

export default function SCAIntegrationsPage() {
  return (
    <IntegrationProvider>
      <SCAIntegrationsContent />
    </IntegrationProvider>
  );
}
