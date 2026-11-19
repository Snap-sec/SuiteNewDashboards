import { useContext, useMemo, useState } from 'react';
import { Blocks, Plug, PlugZap, RefreshCw, Terminal } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import {
  useGetInstalledAutoPtIntegrationsQuery,
  useGetSupportedAutoPtIntegrationsQuery,
} from '@/services/integration/integrationsApi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '@/components/custom/search';
import IntegrationsPanel from './components/integrations-panel';
import RefreshLogs from './components/refresh-logs';
import {
  IntegrationContext,
  IntegrationProvider,
} from './context/integration-context';
import { getAdapterType, getIntegrationList } from './utils';

const TAB_HEADINGS = {
  'all-integrations': {
    title: 'Integrations',
    description:
      'Connect your cloud platforms and code repositories to discover assets, assess security posture, and identify vulnerabilities across your infrastructure and source code.',
  },
  'active-integrations': {
    title: 'Active Integrations',
    description:
      'View and manage currently connected and configured integrations.',
  },
  logs: {
    title: 'Integration Logs',
    description:
      'Monitor sync history, webhook events, and integration execution logs.',
  },
};

function IntegrationsContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all-integrations';
  const supported = useGetSupportedAutoPtIntegrationsQuery(
    { isActive: true },
    { skip: activeTab === 'logs' },
  );
  const installed = useGetInstalledAutoPtIntegrationsQuery(
    { isActive: true },
    { skip: activeTab !== 'active-integrations' },
  );
  const { handleRefreshAll, isRefreshingAll } = useContext(IntegrationContext);
  const [searchQuery, setSearchQuery] = useState('');
  const heading = TAB_HEADINGS[activeTab] || TAB_HEADINGS['all-integrations'];
  const supportedList = useMemo(
    () => getIntegrationList(supported.data),
    [supported.data],
  );
  const activeList = useMemo(
    () =>
      getIntegrationList(installed.data).map((instance) => {
        const type = getAdapterType(instance);
        const definition = supportedList.find(
          (item) =>
            item.id === instance.integrationId ||
            item._id === instance.integrationId ||
            getAdapterType(item) === type,
        );
        return {
          ...definition,
          ...instance,
          instance_id: instance.instance_id || instance._id || instance.id,
          is_installed: true,
        };
      }),
    [installed.data, supportedList],
  );

  return (
    <div className="p-4">
      <Helmet>
        <title>Strike | Integrations</title>
      </Helmet>
      <PageHeading title={heading.title} description={heading.description} />
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setSearchParams((previous) => {
            const next = new URLSearchParams(previous);
            next.set('tab', value);
            return next;
          });
          setSearchQuery('');
        }}
      >
        <TabsList variant="line" size="md">
          <div className="w-full flex flex-wrap gap-1 md:gap-5">
            <TabsTrigger value="all-integrations">
              <Blocks />
              All Integrations
            </TabsTrigger>
            <TabsTrigger value="active-integrations">
              <PlugZap />
              Active Integrations
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Terminal />
              Logs
            </TabsTrigger>
          </div>
          {activeTab !== 'logs' && (
            <div className="w-full flex justify-end">
              <SearchInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search integrations..."
              />
            </div>
          )}
        </TabsList>
        <TabsContent value="all-integrations">
          <IntegrationsPanel
            mode="grid"
            className="py-4"
            integrations={supportedList}
            isLoading={supported.isLoading}
            error={supported.error}
            showSearch={false}
            searchQuery={searchQuery}
          />
        </TabsContent>
        <TabsContent value="active-integrations">
          {activeList.length > 0 && (
            <div className="flex justify-end mt-2.5">
              <Button
                size="sm"
                onClick={handleRefreshAll}
                disabled={isRefreshingAll}
              >
                <RefreshCw
                  className={`size-3.5 ${isRefreshingAll ? 'animate-spin' : ''}`}
                />
                Refresh All
              </Button>
            </div>
          )}
          <IntegrationsPanel
            mode="grid"
            view="active"
            className="py-4"
            integrations={activeList}
            isLoading={
              installed.isLoading || supported.isLoading || isRefreshingAll
            }
            error={installed.error}
            showSearch={false}
            searchQuery={searchQuery}
            emptyTitle="No active integrations available"
            emptyDescription="You haven't installed any integrations yet."
            emptyAction={
              <Button mode="link" underlined="dashed" asChild>
                <Link to="/apt/integrations?tab=all-integrations">
                  <Plug />
                  Install Integration
                </Link>
              </Button>
            }
          />
        </TabsContent>
        <TabsContent value="logs">
          <RefreshLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Integrations() {
  return (
    <IntegrationProvider>
      <IntegrationsContent />
    </IntegrationProvider>
  );
}

export { default as AllIntegrations } from './components/all-integrations';
