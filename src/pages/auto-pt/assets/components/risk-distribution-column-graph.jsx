import React, { useMemo } from 'react';
import ColumnGraph from './graph/columngraph';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const RiskDistributionColumnGraph = ({ assetsData, assetsLoading }) => {
  const assetTypesData = useMemo(() => {
    const types = assetsData?.assetTypes;
    if (!types) return [];

    return Object.entries(types).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value || 0,
    }));
  }, [assetsData?.assetTypes]);

  const isAllZero = assetTypesData.every((item) => item.value === 0);

  if (assetsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-sm font-medium">Asset Types Distribution</h2>
        <DetailedHoverPopover
          buttonText={
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <CircleAlert className="h-4 w-4" />
            </Button>
          }
          showBadge={false}
          popoverTitle="Asset Types Distribution"
          popoverContent={
            <p className="text-muted-foreground">
              Shows the number of assets grouped by type, helping you understand what kinds of assets exist in your environment.
            </p>
          }
        />
      </div>
      {assetTypesData.length === 0 || isAllZero ? (
        <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
          No data available
        </div>
      ) : (
        <ColumnGraph data={assetTypesData} isLoading={assetsLoading} colors={['#e7000b', '#bf564a', '#efb100', '#155dfc']} />
      )}
    </div>
  );
};

export default RiskDistributionColumnGraph;
