import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PieChart from '@/components/custom/charts/pie-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const extractTotals = (input) => {
  return Object?.fromEntries(
    Object?.entries(input)?.map(([key, value]) => [key, value?.total]),
  );
};

const ApplicationDistributionChart = ({
  appDistributionData = {},
  statsLoading,
}) => {
  const typeData = useMemo(() => {
    const distribution = extractTotals(appDistributionData);
    if (!distribution) return [];

    return Object.entries(distribution)
      .filter(([_, value]) => value > 0) // Only show record types with values > 0
      .map(([type, count]) => ({
        name: type,
        value: count,
      }))
      .sort((a, b) => b.value - a.value); //sort by count descending
  }, [appDistributionData]);

  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium flex items-center gap-2">
            Application Distribution
            <DetailedHoverPopover
                buttonText={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                }
                showBadge={false}
                popoverTitle="About this Graph"
                popoverContent={
                  <p className="text-muted-foreground">This graph displays the distribution of different application types within the environment.</p>
                }
            />
        </h2>
      </div>

      <div className="flex justify-center items-center h-full">
        <PieChart data={typeData} isLoading={statsLoading} />
      </div>
    </div>
  );
};

export default ApplicationDistributionChart;
