import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import StatsCards from '../../assets-pages/apis/components/apis-stats-card';
import VulnerabilitySeverityDistributionChart from '../../assets-pages/apis/components/vulnerability-severity-distribution-chart';
import EnvironmentDistributionChart from '../../assets-pages/apis/components/environment-distribution-chart';
import InternalExternalApiChart from '../../assets-pages/apis/components/internal-external-api-chart';
import HttpMethodDistributionChart from '../../assets-pages/apis/components/http-method-distribution-chart';
import AuthDistributionChart from '../../assets-pages/apis/components/auth-distribution-chart';
import CollectionsByWorkspaceChart from '../../assets-pages/apis/components/collections-by-workspace-chart';

export default function ApiDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('api');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VulnerabilitySeverityDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <EnvironmentDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <InternalExternalApiChart statsData={statsData} statsLoading={statsLoading} />
                <HttpMethodDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <AuthDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <CollectionsByWorkspaceChart statsData={statsData} statsLoading={statsLoading} />
            </div>
        </div>
    );
}
