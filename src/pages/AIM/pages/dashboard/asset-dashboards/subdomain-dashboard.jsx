import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import StatsCards from '../../assets-pages/subdomains/components/subdomain-stats-card';
import SeverityDistributionChart from '../../assets-pages/subdomains/components/severity-distribution-chart';
import EnvironmentTypeDistributionChart from '../../assets-pages/subdomains/components/environment-type-distribution-chart';
import ConnectivityDistributionChart from '../../assets-pages/subdomains/components/connectivity-distribution-chart';
import VulnerabilitySeverityStatusChart from '../../assets-pages/subdomains/components/vulnerability-severity-status-chart';
import EnvironmentDistributionChart from '../../assets-pages/subdomains/components/environment-distribution-chart';
import InternalExternalChart from '../../assets-pages/subdomains/components/internal-external-chart';

export default function SubdomainDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('subdomain');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SeverityDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <EnvironmentTypeDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <ConnectivityDistributionChart statsData={statsData} statsLoading={statsLoading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VulnerabilitySeverityStatusChart statsData={statsData} statsLoading={statsLoading} />
                <EnvironmentDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <InternalExternalChart statsData={statsData} statsLoading={statsLoading} />
            </div>
        </div>
    );
}
