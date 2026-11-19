import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import StatsCards from '../../assets-pages/applications/components/applications-stats-card';
import ApplicationTypeDistributionChart from '../../assets-pages/applications/components/charts/application-type-distribution-chart';
import ApplicationSourceDistributionChart from '../../assets-pages/applications/components/charts/application-source-distribution-chart';
import ApplicationStatusDistributionChart from '../../assets-pages/applications/components/charts/application-status-distribution-chart';

export default function ApplicationDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('application');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ApplicationTypeDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <ApplicationSourceDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <ApplicationStatusDistributionChart statsData={statsData} statsLoading={statsLoading} />
            </div>
        </div>
    );
}
