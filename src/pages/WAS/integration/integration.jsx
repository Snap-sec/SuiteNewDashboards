import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useGetApiSecIntegrationQuery } from '@/services/apisec/integrationApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeading from '@/components/custom/page-heading';
import { IntegrationCard } from './components/integration-card';
import ModalRegistry from './components/modal-registry';
import { ContentLoader } from '@/components/common/content-loader';
import { IntegrationProvider } from './context/integration-context';
import Select from '@/components/custom/select';
import { IntegrationSkeleton } from './components/skeletons/integrations-skeletons';
import { ActiveIntegrationSkeleton } from './components/skeletons/active-integrations-skeleton';
import ApiErrorHandler from '@/components/common/api-error-handler';


function Integration() {
  const { data: allIntegrationsData, isLoading: isLoadingAll, error: errorAll, isError: isErrorAll } = useGetApiSecIntegrationQuery({});
  const { data: activeIntegrationsData, isLoading: isLoadingActive, error: errorActive, isError: isErrorActive } = useGetApiSecIntegrationQuery(
    { installed: true },
    { pollingInterval: 3000 }
  );

  

  const [selectedCategory, setSelectedCategory] = useState('All');

  const hydratedAllAdapters = useMemo(() => {
    const apiData = allIntegrationsData?.data || [];
    return apiData.map(adapter => ({
      ...adapter,
      title: adapter.name,
      description: adapter.description,
      logo: adapter.logo_url,
      is_installed: adapter.status === 'installed',
      instance_id: adapter._id,
      installable: adapter.is_installable,
      docs_url: adapter.docs_link,
      category: adapter.category || ['General'], // Default category if missing
      slug: adapter.type // Ensure slug is available for modals
    }));
  }, [allIntegrationsData]);

  const hydratedActiveAdapters = useMemo(() => {
    const apiData = activeIntegrationsData?.data || [];
    return apiData.map(adapter => ({
      ...adapter,
      title: adapter.name,
      description: adapter.description,
      logo: adapter.logo_url,
      is_installed: adapter.status === 'installed',
      instance_id: adapter._id,
      installable: adapter.is_installable,
      docs_url: adapter.docs_link,
      category: adapter.category || ['General'],
      slug: adapter.type
    }));
  }, [activeIntegrationsData]);


  // Extract unique categories from hydrated adapters
  const uniqueCategories = ['All', ...new Set(hydratedAllAdapters.flatMap(adapter => adapter.category || []))];

  const filteredAdapters = selectedCategory === 'All'
    ? hydratedAllAdapters
    : hydratedAllAdapters.filter(adapter => adapter.category?.includes(selectedCategory));

  const categoryOptions = uniqueCategories.map(cat => ({
    label: cat,
    value: cat
  }));

  if (isErrorAll) return <ApiErrorHandler error={errorAll} />;
  if (isErrorActive) return <ApiErrorHandler error={errorActive} />;

  return (
    <IntegrationProvider>
      <div className="p-4 space-y-8">
        <Helmet>
          <title>WAS | Integrations</title>
        </Helmet>

        <PageHeading title="Integrations" description="List of Integrations" />

        <div className="space-y-4">
          <Tabs defaultValue="all-integrations">
            <TabsList
              variant="line"
              size="md"
              className="w-full flex flex-wrap gap-1 md:gap-5"
            >
              <TabsTrigger value="all-integrations">All Integrations</TabsTrigger>
              <TabsTrigger value="active-integrations">Active Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="all-integrations">

              {isLoadingAll && <IntegrationSkeleton />}

              <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {!isLoadingAll && filteredAdapters?.map((adapter, idx) => (
                  <IntegrationCard key={idx} adapter={adapter} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active-integrations">
              {isLoadingActive && <ActiveIntegrationSkeleton />}

              <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {!isLoadingActive && hydratedActiveAdapters?.map((adapter, idx) => (
                  <IntegrationCard key={idx} adapter={adapter} />
                ))}
                {!isLoadingActive && hydratedActiveAdapters?.length === 0 && (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No active integrations found.
                  </div>
                )}
              </div>
            </TabsContent>

          </Tabs>
        </div>


        <ModalRegistry />
      </div>
    </IntegrationProvider>
  );
}

export default Integration;


