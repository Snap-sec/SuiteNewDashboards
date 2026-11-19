import { Bug, Building, Search, SearchSlashIcon } from 'lucide-react';
import MetricsCard from './MetricsCard';
import VulnChart from './VulnChart';

function Analytics({ stats = {}, timeline = [], vulnBreakdown = [], period, setPeriod, isLoading }) {
  return (
    <div className="w-full flex gap-4 items-stretch">
      <div className="w-2/3">
        <VulnChart timeline={timeline} vulnBreakdown={vulnBreakdown} period={period} setPeriod={setPeriod} isLoading={isLoading} />
      </div>
      <div className="w-1/3 grid grid-cols-2 gap-4 h-full">
        <MetricsCard
          icon={<Bug className='mt-4 ms-5 lucide lucide-layout-dashboard text-blue-500' />}
          title="Total Vulnerabilities"
          info={stats.totalVulns ?? '-'}
          isLoading={isLoading}
        />
        <MetricsCard
          icon={<Search className='mt-4 ms-5 lucide lucide-layout-dashboard text-blue-500' />}
          title="Total Scans"
          info={stats.totalScans ?? '-'}
          isLoading={isLoading}
        />
        <MetricsCard
          icon={<SearchSlashIcon className='mt-4 ms-5 lucide lucide-layout-dashboard text-blue-500' />}
          title="Total Scanners"
          info={stats.totalScanners ?? '-'}
          isLoading={isLoading}
        />
        <MetricsCard
          title="Total Assets"
          icon={<Building className='mt-4 ms-5 lucide lucide-layout-dashboard text-blue-500' />}
          info={stats.totalAssets ?? '-'}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Analytics;
