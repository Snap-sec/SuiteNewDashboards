import { BasicDetails } from "./components/basic-details";
import { VulnerabilityTrendGraph } from "./components/vulnerability-trend-graph";
import { SeverityGraph } from "./components/severity-graph";
import { Tags } from "./components/tags";
import { useParams } from "react-router-dom";
import { ContentLoader } from "@/components/common/content-loader";
import { AssetRelationGraph } from "@/components/custom/asset-relation-graph";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Technologies } from "./components/technologies";
import { OpenPorts } from "./components/open-ports";

import { useGetAsmAssetsDetailsByIdQuery } from "../../../services/asm/attackSurfaceApi";


function AsmGlobalAssetDetails() {
    const { assetId } = useParams();

    const { data: asset, isLoading, error } = useGetAsmAssetsDetailsByIdQuery(assetId);


    if (isLoading) {
        return <ContentLoader className="h-[calc(100vh-64px)]" />;
    }


    if (error) {
        return (
            <div className="flex flex-col items-center justify-center grow h-[95%]">
                <img
                    src="/media/illustrations/20-dark.svg"
                    alt="Error"
                    className="w-64 h-64 mb-4"
                />
                <div className="text-xl font-semibold text-red-600">
                    {error?.data?.message || 'Error loading asset data'}
                </div>
                <div className="text-gray-500 mt-2">
                    Please try again later or contact support
                </div>
            </div>
        );
    }

    return (
        <div className="p-12 flex flex-col gap-4 w-full">
            <BasicDetails asset={asset?.asset} />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                    <VulnerabilityTrendGraph asset={asset?.asset?.properties?.vulnTimeline} />
                </div>
                <div className="col-span-4">
                    <SeverityGraph title="Severity Distribution" asset={asset?.asset?.properties?.vulnerabilityStats} />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                    <div classname="flex flex-col">
                        <div>
                            <Tags title="Tags" data={asset?.asset?.tags} />
                        </div>

                        <div className="mt-4">
                            <Technologies title="Technologies" data={asset?.asset?.technologies} />
                        </div>

                        <div className="mt-4">
                            <OpenPorts title="Open Ports" data={asset?.asset?.properties?.ports} />
                        </div>
                    </div>
                </div>
                <div className="col-span-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Asset Relation</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <AssetRelationGraph
                                data={asset?.asset}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AsmGlobalAssetDetails;