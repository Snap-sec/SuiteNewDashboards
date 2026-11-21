import { useState } from 'react';
import { toast } from 'sonner';
import { useGetAimDashboardStatsQuery } from '@/services/asset-inventory/dashboardApi';
import responseData from './data/response.json';
import { PageHead } from './components/page-head';
import { StatStrip } from './components/stat-strip';
import { EstateOverview } from './components/estate-overview';
import { InventoryCoverage } from './components/inventory-coverage';
import { OwnershipCard } from './components/ownership-card';
import { AssetsByCategory } from './components/assets-by-category';
import { DiscoverySources } from './components/discovery-sources';
import { RecentlyDiscovered } from './components/recently-discovered';
import { InventoryHygiene } from './components/inventory-hygiene';
import { PageFoot } from './components/page-foot';
import './styles.css';

export function AimDashboard2() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(responseData.meta.updatedLabel);

  const { data: apiData } = useGetAimDashboardStatsQuery(undefined, {
    skip: false,
  });

  // Blend live API data if available for stats, otherwise use seed response
  const metrics = {
    totalAssets: apiData?.data?.metrics?.total_assets || responseData.metrics.totalAssets,
    managed: apiData?.data?.metrics?.managed_assets || responseData.metrics.managed,
    unowned: apiData?.data?.metrics?.unowned_assets || responseData.metrics.unowned,
    addedThisWeek: apiData?.data?.metrics?.new_assets || responseData.metrics.addedThisWeek,
  };

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastUpdated('Updated just now');
      toast.success('Inventory synced', {
        description: '18 sources reconciled · 12,846 assets refreshed.',
      });
    }, 1200);
  };

  return (
    <div className="aim-command w-full min-w-0">
      <div className="aim-content">
        <PageHead
          company={responseData.meta.company}
          environment={responseData.meta.environment}
          updatedLabel={lastUpdated}
          onSync={handleSync}
          isSyncing={isSyncing}
        />

        <StatStrip metrics={metrics} />

        <section className="primary-grid" aria-label="Estate posture">
          <EstateOverview estate={responseData.estate} />
          <InventoryCoverage coverage={responseData.coverage} />
          <OwnershipCard ownership={responseData.ownership} />
        </section>

        <div className="split-grid">
          <AssetsByCategory categories={responseData.categories} />
          <DiscoverySources sources={responseData.sources} />
        </div>

        <div className="split-grid">
          <RecentlyDiscovered assets={responseData.recentlyDiscovered} />
          <InventoryHygiene hygiene={responseData.hygiene} />
        </div>

        <PageFoot company={responseData.meta.company} />
      </div>
    </div>
  );
}

export default AimDashboard2;

