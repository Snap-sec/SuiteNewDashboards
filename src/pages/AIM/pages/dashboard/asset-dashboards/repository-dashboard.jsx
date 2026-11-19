import { useGetAimAssetStatsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import StatsCards from '../../assets-pages/repositories/components/repo-stats-card';
import VulnerableVsSafeRepoChart from '../../assets-pages/repositories/components/vulnerable-vs-safe-repo-chart';
import RepoVisibilityChart from '../../assets-pages/repositories/components/repo-visibility-chart';
import ReposCreatedLastYearChart from '../../assets-pages/repositories/components/repos-created-last-year-chart';
import ActivityChart from '../../assets-pages/repositories/components/charts/activity-chart';
import ArchiveStatusChart from '../../assets-pages/repositories/components/charts/archive-status-chart';
import TechnologyDistributionChart from '../../assets-pages/repositories/components/charts/technology-distribution-chart';

export default function RepositoryDashboard() {
    const { data: statsData, isLoading: statsLoading } = useGetAimAssetStatsQuery('repository');


    return (
        <div className="space-y-4">
            <StatsCards statsData={statsData?.metrics} statsLoading={statsLoading} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VulnerableVsSafeRepoChart statsData={statsData} statsLoading={statsLoading} />
                <RepoVisibilityChart statsData={statsData} statsLoading={statsLoading} />
                <ReposCreatedLastYearChart statsData={statsData} statsLoading={statsLoading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActivityChart statsData={statsData?.activity_distribution} statsLoading={statsLoading} />
                <ArchiveStatusChart statsData={statsData?.archived_distribution} statsLoading={statsLoading} />
                <TechnologyDistributionChart statsData={statsData} statsLoading={statsLoading} />
            </div>
        </div>
    );
}
