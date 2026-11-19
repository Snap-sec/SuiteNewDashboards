import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import VendorDistributionPiechart from '../../assets-pages/employees/components/charts/vendor-distributon-chart';
import TestingStatusByEnvironment from '../../assets-pages/employees/components/charts/testing-satus-by-environment-chart';
import ActivityDistributionChart from '../../assets-pages/employees/components/charts/activity-distribution-chart';
import StatsCards from '../../assets-pages/employees/components/cards/employees-stats-cards';

export default function EmployeeDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('employee');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VendorDistributionPiechart
                    statsData={statsData?.vendor_distribution}
                    statsLoading={statsLoading}
                />
                <TestingStatusByEnvironment
                    statsData={statsData?.internal_external_distribution}
                    statsLoading={statsLoading}
                />
                <ActivityDistributionChart
                    statsData={statsData?.activity_distribution}
                    statsLoading={statsLoading}
                />
            </div>
        </div>
    );
}
