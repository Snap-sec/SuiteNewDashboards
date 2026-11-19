import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentLoader } from '../../../../components/common/content-loader';
import { useGetAimBusinessUnitByIdQuery } from '../../../../services/asset-inventory/businessUnitsApi';
import ApplicationRiskTab from './components/tabs/application-risk';
import AssociatedAssetsTab from './components/tabs/associated-assets';
import BusinessDetailsTab from './components/tabs/business-details';
import BusinessUnitVulnerabilitiesTab from './components/tabs/vulnerabilities';

const TABS = [
  { value: 'details', label: 'Details' },
  { value: 'risk', label: 'Risk Assessment' },
  { value: 'assets', label: 'Associated Assets' },
  { value: 'vulnerabilities', label: 'Vulnerabilities' },
];

function BusinessUnitDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || TABS[0].value;

  const handleTabChange = (value) => {
    setSearchParams((prev) => {
      prev.set('tab', value);
      return prev;
    });
  };

  const { data: businessUnitStats, isLoading, isError, error } =
    useGetAimBusinessUnitByIdQuery(id);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full p-4"
    >
      <TabsList variant="line">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="details">
        <BusinessDetailsTab businessUnitStats={businessUnitStats} isLoading={isLoading} isError={isError} error={error} />
      </TabsContent>

      <TabsContent value="risk">
        <ApplicationRiskTab businessUnitStats={businessUnitStats} isError={isError} error={error} />
      </TabsContent>

      <TabsContent value="assets">
        <AssociatedAssetsTab businessUnitId={id} isError={isError} error={error} />
      </TabsContent>

      <TabsContent value="vulnerabilities">
        <BusinessUnitVulnerabilitiesTab businessUnitId={id} activeTab={activeTab} isError={isError} error={error} />
      </TabsContent>
    </Tabs>
  );
}

export default BusinessUnitDetails;
