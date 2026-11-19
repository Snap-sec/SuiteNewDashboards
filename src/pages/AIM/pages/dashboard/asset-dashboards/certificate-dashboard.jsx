import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import StatsCards from '../../assets-pages/certificates/components/certificates-stats-card';
import ValidVsExpiredChart from '../../assets-pages/certificates/components/valid-vs-expired-chart';
import SelfSignedDistributionChart from '../../assets-pages/certificates/components/self-signed-distribution-chart';
import IssuerCountryDistributionChart from '../../assets-pages/certificates/components/issuer-country-distribution-chart';
import ValidityDistributionColumnGraph from '../../assets-pages/certificates/components/validity-distribution-column-graph';
import SigningAuthorityDistributionPiechart from '../../assets-pages/certificates/components/signing-authority-distribution-piechart';

export default function CertificateDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('certificate');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ValidVsExpiredChart statsData={statsData} statsLoading={statsLoading} />
                <SelfSignedDistributionChart statsData={statsData} statsLoading={statsLoading} />
                <IssuerCountryDistributionChart statsData={statsData} statsLoading={statsLoading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidityDistributionColumnGraph statsData={statsData} statsLoading={statsLoading} />
                <SigningAuthorityDistributionPiechart statsData={statsData} statsLoading={statsLoading} />
            </div>
        </div>
    );
}
