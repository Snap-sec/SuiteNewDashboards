import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import StatsCards from '../../assets-pages/ip-addresses/components/ip-address-stats-card';
import ExternallyReachableDistributionChart from '../../assets-pages/ip-addresses/components/externally-reachable-distribution-chart';
import LocationDistributionChart from '../../assets-pages/ip-addresses/components/location-distribution-chart';
import VulnerableVsSafeDistributionChart from '../../assets-pages/ip-addresses/components/vulnerable-vs-safe-distribution-chart';
import VulnerabilitySeverityStatusChart from '../../assets-pages/ip-addresses/components/vulnerability-severity-status-chart';
import IpExposureDistributionPiechart from '../../assets-pages/ip-addresses/components/ip-exposure-distribution-piechart';
import AsnDistributionColumnGraph from '../../assets-pages/ip-addresses/components/asn-distribution-column-graph';

export default function IpDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('ip');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ExternallyReachableDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <LocationDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <VulnerableVsSafeDistributionChart statsData={statsData} statsLoading={statsLoading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VulnerabilitySeverityStatusChart statsData={statsData} statsLoading={statsLoading} />
                <IpExposureDistributionPiechart statsData={statsData} statsLoading={statsLoading} />
                <AsnDistributionColumnGraph statsData={statsData} statsLoading={statsLoading} />
            </div>
        </div>
    );
}
