import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import StatsCards from '../../assets-pages/object-storages/components/objectstorage-stats-card';
import SeverityDistributionPiechart from '../../assets-pages/components/severity-distribution-piechart';
import ProviderDistributionPiechart from '../../assets-pages/object-storages/components/charts/provider-distribution-piechart';
import RegionDistributionColumnGraph from '../../assets-pages/object-storages/components/charts/region-distribution-column-graph';

export default function ObjectStorageDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('object_storage');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SeverityDistributionPiechart statsData={statsData} statsLoading={statsLoading} />
                <ProviderDistributionPiechart statsData={statsData?.provider_distribution || {}} />
                <RegionDistributionColumnGraph statsData={statsData?.region_distribution || {}} />
            </div>
        </div>
    );
}
