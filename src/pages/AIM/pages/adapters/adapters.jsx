import { useState } from 'react';
import { Blocks, ChartGantt, Radio, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import {
  useGetAimActiveAdapterQuery,
  useGetAimAdapterListQuery,
  useRefreshAllAimAdaptersMutation,
} from '@/services/asset-inventory/adaptersApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Select from '@/components/custom/select';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import PageHeading from '../../../../components/custom/page-heading';
import { SearchInput } from '../../../../components/custom/search';
import { Skeleton } from '../../../../components/ui/skeleton';
import { IntegrationCard } from './components/integration-card';
import ModalRegistry from './components/modal-registry';
import RefreshLogs from './components/refresh-logs';
import { AdapterInfoCardSkeleton } from './components/skeletons/adapters-infor-card-skeleton';
import { IntegrationProvider } from './context/integration-context';
import { useStore } from './store';

const TAB_HEADINGS = {
  'all-integrations': {
    title: 'Integrations',
    description:
      'Discover and connect security tools, cloud providers, and asset sources across your environment.',
  },
  'active-integrations': {
    title: 'Active Integrations',
    description:
      'Monitor, configure, and synchronize connected adapters to continuously update your asset inventory.',
  },
  'refresh-logs': {
    title: 'Refresh Logs',
    description:
      'Track synchronization history, status updates, and execution logs for all configured adapters.',
  },
};

function AdaptersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all-integrations';
  const heading = TAB_HEADINGS[currentTab] || TAB_HEADINGS['all-integrations'];

  const {
    data,
    isLoading: adaptersLoading,
    isError: isAdaptersError,
    error: adaptersError,
  } = useGetAimAdapterListQuery();
  const {
    data: activeAdaptersData,
    isLoading: activeAdaptersLoading,
    isError: isActiveAdaptersError,
    error: activeAdaptersError,
  } = useGetAimActiveAdapterQuery(null, { pollingInterval: 5000 });
  const [refreshAllAimAdapters] = useRefreshAllAimAdaptersMutation();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState(currentTab);
  const [searchQuery, setSearchQuery] = useState('');

  const { setSelectedTab } = useStore();

  const categories = ['All', ...(data?.categories || [])];

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

  const activeAdapters = filterBySearch(activeAdaptersData?.integrations || []);

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
    setActiveTab(value);
    setSelectedTab(value);
  };

  const handleRefreshAllAdapters = async () => {
    try {
      await refreshAllAimAdapters();
    } catch (error) {
      console.error('Error refreshing all adapters:', error);
    }
  };

  return (
    <IntegrationProvider>
      <div className="p-4">
        <Helmet>
          <title>{`AssetIQ | ${heading.title}`}</title>
        </Helmet>

        <div className="w-full flex items-center justify-between mb-4">
          <PageHeading
            title={heading.title}
            description={heading.description}
          />

          <AuthorityGuard forbidRoles={['Auditor']}>
            {currentTab == 'active-integrations' &&
              activeAdapters?.length > 0 && (
                <ButtonWithConfirm
                  variant="outline"
                  confirm={true}
                  onConfirm={handleRefreshAllAdapters}
                >
                  <RefreshCcw /> Refresh All Adapters
                </ButtonWithConfirm>
              )}
          </AuthorityGuard>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList variant="line" size="md">
            <div className="w-full flex flex-wrap gap-1 md:gap-5">
              <TabsTrigger value="all-integrations">
                {' '}
                <Blocks /> All Integrations
              </TabsTrigger>
              <TabsTrigger value="active-integrations">
                <Radio /> Active Integrations
              </TabsTrigger>
              <TabsTrigger value="refresh-logs">
                <ChartGantt /> Refresh Logs
              </TabsTrigger>
            </div>

            <div className="w-full flex justify-end">
              {currentTab !== 'refresh-logs' && (
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search integrations..."
                />
              )}
            </div>
          </TabsList>

          <TabsContent value="all-integrations">
            <div className="flex justify-between items-center mt-2.5">
              {!adaptersLoading && (
                <div className="text-sm text-gray-500">
                  {activeAdaptersData?.count || 0} installed out of{' '}
                  {filteredAdapters?.length || 0} integrations
                </div>
              )}

              {adaptersLoading && <Skeleton className={' h-8 w-40'} />}

              {!adaptersLoading && (
                <div className="w-[200px]">
                  <Select
                    value={selectedCategory}
                    onChange={(option) =>
                      setSelectedCategory(option?.value || 'All')
                    }
                    options={categoryOptions}
                    placeholder="Filter by Category"
                    searchPlaceholder="Search by Category"
                    enableSearch={true}
                  />
                </div>
              )}
              {adaptersLoading && <Skeleton className={' h-8 w-50'} />}
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adaptersLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <AdapterInfoCardSkeleton key={i} />
                ))
              ) : isAdaptersError ? (
                <div className="col-span-full">
                  <ApiErrorHandler error={adaptersError} />
                </div>
              ) : filteredAdapters?.length > 0 ? (
                filteredAdapters.map((adapter) => (
                  <IntegrationCard
                    key={adapter.type}
                    adapter={adapter}
                    activeTab={activeTab}
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
              {activeAdaptersLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <AdapterInfoCardSkeleton key={i} />
                ))
              ) : isActiveAdaptersError ? (
                <div className="col-span-full">
                  <ApiErrorHandler error={activeAdaptersError} />
                </div>
              ) : activeAdapters?.length > 0 ? (
                activeAdapters.map((adapter) => (
                  <IntegrationCard
                    key={adapter._id}
                    adapter={adapter}
                    activeTab={activeTab}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyScreen
                    title="No active integrations found"
                    subTitle={
                      searchQuery
                        ? `We couldn't find any active integrations matching "${searchQuery}".`
                        : "You haven't installed any integrations yet."
                    }
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="refresh-logs">
            <RefreshLogs />
          </TabsContent>
        </Tabs>

        <ModalRegistry />
      </div>
    </IntegrationProvider>
  );
}

export default AdaptersPage;
