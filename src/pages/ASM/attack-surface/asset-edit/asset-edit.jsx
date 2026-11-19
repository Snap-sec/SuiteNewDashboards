import { useParams, useSearchParams } from 'react-router-dom';
import { useGetAsmAssetsDetailsByIdQuery, useGetAsmAssetSignalsDataQuery } from '@/services/asm/attackSurfaceApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AssetHeader from './asset-edit3-components/AssetHeader';
import GeneralInfoSection from './asset-edit3-components/GeneralInfoSection';
import ActivityTab from './tabs/activity-log/ActivityTab';
import AssetSignalsTab from './tabs/signals/AssetSignalsTab';
import ApiErrorHandler from '@/components/common/api-error-handler';
import AssetExposuresTab from './tabs/exposures/AssetExposuresTab';

function AssetEdit3({ id: propId, onBack }) {
  const params = useParams();
  const id = propId || params.id || params.assetId;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const { data: assetData, isLoading,isError, error } = useGetAsmAssetsDetailsByIdQuery(id);
  const asset = assetData?.data || assetData;

  const { data: signalsData } = useGetAsmAssetSignalsDataQuery(id, { skip: !id });
  const signalsCount = (signalsData?.data || signalsData?.signals || signalsData || []).length;

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 flex flex-col gap-6 max-w-full animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-60 rounded" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40 rounded" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-4 border-b border-border/60 pb-2">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>

        {/* Details Content Skeleton */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton className="h-3.5 w-80 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6 max-w-full">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="w-fit mb-0 -ml-4 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Assets
        </Button>
      )}

      <AssetHeader asset={asset} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4" variant="line">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="signals" className="flex gap-2 items-center">
            Signals
            {signalsCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                {signalsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="exposures">Exposures</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex flex-col gap-6 p-0 mt-0">
          <GeneralInfoSection asset={asset} />
        </TabsContent>

        <TabsContent value="timeline" className="p-0 mt-0">
          <ActivityTab />
        </TabsContent>

        <TabsContent value="signals" className="p-0 mt-0">
          <AssetSignalsTab />
        </TabsContent>

        <TabsContent value="exposures" className="p-0 mt-0">
          <AssetExposuresTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AssetEdit3;


