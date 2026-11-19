import { useGetAsmAssetGeneralDetailsQuery } from '@/services/asm/attackSurfaceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AssetRelationGraph } from '@/components/custom/asset-relation-graph';
import { NoSearchResultsFound } from '../../../../../../../../components/common/no-search-found';
import { BasicDetails } from '../../../../../../../AIM/pages/assets-pages/global-asset-details/components/basic-details';
import { OpenPorts } from '../../../../../../../AIM/pages/assets-pages/global-asset-details/components/open-ports';
import { SeverityGraph } from '../../../../../../../AIM/pages/assets-pages/global-asset-details/components/severity-graph';
import { Tags } from '../../../../../../../AIM/pages/assets-pages/global-asset-details/components/tags';
import { Technologies } from '../../../../../../../AIM/pages/assets-pages/global-asset-details/components/technologies';
import { VulnerabilityTrendGraph } from '../../../../../../../AIM/pages/assets-pages/global-asset-details/components/vulnerability-trend-graph';
import SkeletonLoader from './asset-details-content-skeleton';

const AssetDetailsContent = ({ value, type, isOpen }) => {
  const {
    data: assetDetails,
    isLoading: isLoadingAssetDetails,
    isError,
    error,
  } = useGetAsmAssetGeneralDetailsQuery(
    { value, type },
    { skip: !isOpen }, // <-- prevent query until modal is open
  );

  if (isLoadingAssetDetails) return <SkeletonLoader />;

  if (isError)
    return (
      <NoSearchResultsFound
        title={error?.data?.error || 'Hmm... Nothing Here'}
        subTitle="The asset you're looking for doesn't exist or is currently unavailable."
      />
    );

  if (assetDetails?.data?.asset)
    return (
      <div className="w-full h-[calc(100vh-100px)] flex gap-6">
        <ScrollArea className="h-full overflow-y-auto p-2 flex flex-col gap-4 w-full ">
          <div className="flex flex-col gap-4">
            <BasicDetails asset={assetDetails?.data?.asset} />

            {/* Graphs Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <VulnerabilityTrendGraph
                  asset={assetDetails?.data?.asset?.properties?.vulnTimeline}
                />
              </div>
              <div className="col-span-4">
                <SeverityGraph
                  title="Severity Distribution"
                  asset={
                    assetDetails?.data?.asset?.properties?.vulnerabilityStats
                  }
                />
              </div>
            </div>

            {/* Tags, Technologies, Ports + Asset Graph */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="col-span-4">
                <div classname="flex flex-col">
                  <div>
                    <Tags title="Tags" data={assetDetails?.data?.asset?.tags} />
                  </div>

                  <div className="mt-4">
                    <Technologies
                      title="Technologies"
                      data={assetDetails?.data?.asset?.technologies}
                    />
                  </div>

                  <div className="mt-4">
                    <OpenPorts
                      title="Open Ports"
                      data={assetDetails?.data?.asset?.properties?.ports}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Relation</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <AssetRelationGraph data={assetDetails?.data?.asset} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
};

export default AssetDetailsContent;
