import { ChartNoAxesGantt } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_TO_ICON } from '../../config';
import { useStore } from '../../store';
import ScannerColumnCard, { ScannerColumnCardSkeleton } from '../cards/scanner-column-card';
import ScannerRowCard from '../cards/scanner-row-card';
import { NoSearchResultsFound } from "@/components/common/no-search-found"

const ScannersList = ({ scanners = [], isLoading }) => {
  const activeView = useStore((state) => state.activeView);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ScannerColumnCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && scanners?.length == 0) return <NoSearchResultsFound />;

  return (
    <div className="flex flex-col items-stretch gap-5 lg:gap-4">
      {/* Card View */}
      {activeView === 'cards' && (
        <div id="projects_cards">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-4">
            {scanners?.map((scanner, index) => {
              return (
                <ScannerColumnCard
                  title={scanner?.name}
                  ip={scanner?.ip}
                  lastHeartbeat={scanner?.last_heartbeat}
                  isDefault={scanner?.default}
                  vulnerabilities={scanner?.vulnCount}
                  remediationPercentage={
                    scanner?.totalVulns && scanner?.totalVulns !== 0
                      ? (
                          ((scanner?.totalVulns - (scanner?.openVulns || 0)) /
                            scanner?.totalVulns) *
                          100
                        ).toFixed(0)
                      : '0'
                  }
                  key={index}
                  scanner={scanner}
                  active={scanner?.active}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {/* {activeView === 'list' && (
        <div id="projects_list">
          <div className="flex flex-col gap-5 lg:gap-7.5">
            {scanners?.map((item, index) => {
              return (
                <ScannerRowCard
                  assId={item?._id}
                  icon={
                    CATEGORY_TO_ICON[item.category] || (
                      <ChartNoAxesGantt className="w-10 h-10 text-foreground" />
                    )
                  }
                  title={item?.title}
                  description={item?.description}
                  status={item?.state}
                  vulnerabilities={item?.vulnMetrics}
                  remediationPercentage={
                    item?.totalVulns && item?.totalVulns !== 0
                      ? (
                          ((item?.totalVulns - (item?.openVulns || 0)) /
                            item?.totalVulns) *
                          100
                        ).toFixed(0)
                      : '0'
                  }
                  key={index}
                />
              );
            })}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ScannersList;
