import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import PageHeading from '@/components/custom/page-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Staged from '../staged/staged';
import Decomissioned from '../decomissioned/decomissioned';

export function ExpiredAssets({ defaultTab = 'staged' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || defaultTab;

  const handleTabChange = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', val);
      return next;
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>AssetIQ | Retired Assets</title>
      </Helmet>

      <PageHeading
        title="Retired Assets"
        description="Review and manage assets currently staged or decommissioned from your estate."
      />

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList
          variant="line"
          size="md"
          className="border-b w-full justify-start overflow-x-auto gap-6"
        >
          <TabsTrigger value="staged">Staged</TabsTrigger>
          <TabsTrigger value="decommissioned">Decommissioned</TabsTrigger>
        </TabsList>

        <TabsContent value="staged" className="mt-0">
          <Staged hideHeading />
        </TabsContent>

        <TabsContent value="decommissioned" className="mt-0">
          <Decomissioned hideHeading />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ExpiredAssets;

